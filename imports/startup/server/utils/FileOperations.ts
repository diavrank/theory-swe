import fs from 'fs-extra';
import { Meteor } from 'meteor/meteor';
import mimeTypes from 'mimetypes';
import { firebaseAdminStorage } from '../services/FirebaseAdmin';
import { ResponseMessage } from './ResponseMessage';
import Utilities from './helpers';

if (Meteor.isDevelopment) {
	if (Meteor.settings.private && Meteor.settings.private.STORAGE_PATH) {
		process.env.STORAGE_PATH = Meteor.settings.private.STORAGE_PATH;
	} else {
		process.env.STORAGE_PATH = process.env.PWD;
	}
}

export default {
	path_upload_files: process.env.STORAGE_PATH + '/.uploads',
	PATH_USER_FILE: 'users/',
	async fileTypeModule() {
		// Import a pure ESM package from a CommonJS TS project
		const esmModule = await import("file-type");

		return esmModule;
	},
	/**
	 * Saves a file in the private directory.
	 * @param blob
	 * @param name
	 * @param path
	 * @param encoding
	 */
	saveFile(blob: any, name: string, path: string) {
		let success = false;
		const encoding = 'binary';
		const chroot = this.path_upload_files;
		path = chroot + (path ? `/${path}` : '');

		fs.ensureDirSync(path);
		const writeFileSync = Meteor.wrapAsync(fs.writeFile);
		try {
			writeFileSync(`${path}/${name}`, blob, encoding);
			success = true;
		} catch (error) {
			console.error('There was an error during saving the file: ', error);
		}
		return success;
	},
	async getFile(path: string) {
		const buffer = fs.readFileSync(this.path_upload_files + '/' + path);
		const { fileTypeFromFile } = await this.fileTypeModule();
		const mime = await fileTypeFromFile(this.path_upload_files + '/' + path);

		return { data: buffer, meta: mime };
	},
	/**
	 * Saves a file in the private directory
	 * @param base64file
	 * @param name
	 * @param path
	 * @returns {Promise<any>}
	 */
	async saveFileFromBase64(base64file: string, name: string, path: string) {
		const responseMessage = new ResponseMessage();
		try {
			const encoding = 'base64';
			fs.ensureDirSync(`${this.path_upload_files}/${path}`);
			const base64EncodedImageString = base64file.split(';base64,').pop();
			// @ts-ignore
			const mimeType = base64file.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
			const filename = `${name}${Utilities.generateNumberToken(10, 99)}.${mimeTypes.detectExtension(mimeType)}`;
			const fileUrl = `${process.env.ROOT_URL}/api/${path}/${filename}`;
			await new Promise((resolve, reject) => {
				fs.writeFile(`${this.path_upload_files}/${path}/${filename}`, base64EncodedImageString, encoding, (err) => {
					if (err) {
						reject(`Failed to save file: ${err}`);
					} else {
						resolve('File saved successfully!');
					}
				});
			});
			responseMessage.create('File saved', undefined, { success: true, fileUrl });
		} catch (exception) {
			console.error('Error saving file to server storage: ', exception);
			responseMessage.create('There was an error to save file', undefined, { success: false });
		}
		return responseMessage;
	},
	async saveFileFromBufferToGoogleStorage(fileBuffer: any, name: string, path: string, mimeType: string) {
		const responseMessage = new ResponseMessage();
		const filename = `${name}${Utilities.generateNumberToken(10, 99)}.${mimeTypes.detectExtension(mimeType)}`;
		const file = firebaseAdminStorage.file(`${path}/${filename}`);
		try {
			await file.save(fileBuffer, {
				metadata: {
					contentType: mimeType
				},
				validation: false
			});
			const [fileUrl] = await file.getSignedUrl({
				action: 'read',
				expires: '2491-03-09'
			});
			responseMessage.create('File uploaded', undefined, { success: true, fileUrl });
		} catch (exception) {
			console.error('Error uploading file to Google Storage: ', exception);
			responseMessage.create('There was an error to upload file', undefined, { success: false });
		}
		return responseMessage;
	},
	/**
	 * Save a file to Google Cloud Storage
	 * @param base64file data_url format in base64, e.g. data:image/png;base64,iVBOR...
	 * @param name Filename without extension. Extension is calculated from base64file
	 * @param path Path of the file in Google Cloud Storage
	 * @returns {Promise<ResponseMessage>}
	 */
	async saveFileFromBase64ToGoogleStorage(base64file: string, name: string, path: string) {
		let responseMessage = new ResponseMessage();
		// @ts-ignore
		const mimeType = base64file.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
		const base64EncodedImageString = base64file.split(';base64,').pop();
		// @ts-ignore
		const fileBuffer = Buffer.from(base64EncodedImageString, 'base64');
		responseMessage = await this.saveFileFromBufferToGoogleStorage(fileBuffer, name, path, mimeType);
		return responseMessage;
	},
	async deleteFileFromGoogleStorageIfExists(fileLocation: string) {
		const file = firebaseAdminStorage.file(fileLocation);
		try {
			const existsFile = await file.exists();
			if (existsFile[0]) {
				await file.delete();
			}
		} catch (exception) {
			console.error('Error deleting file from Google Storage: ', exception);
		}
	},
	async deleteFilesOfFolderFromGoogleStorageIfExists(userFolder: string) {
		try {
			await firebaseAdminStorage.deleteFiles({ prefix: userFolder + '/' });
		} catch (exception) {
			console.error('Error deleting file from Google Storage: ', exception);
		}
	},
	/**
	 * Remove a file or directory synchronously.
	 * @param path
	 */
	remove(path: string) {
		if (path) {
			path = `${this.path_upload_files}/${path}`;
			fs.removeSync(path);
		}
	}
};
