import { Meteor } from 'meteor/meteor';
import fs from 'fs-extra';
// @ts-ignore
import mimeTypes from 'mimetypes';
// @ts-ignore
import detect from 'detect-file-type';
import { firebaseAdminStorage, BASE_URL_STORAGE } from '../services/FirebaseAdmin';
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
	path_binnacle_files: process.env.STORAGE_PATH + '/.binnacle',
	PATH_USER_FILE: 'users/',
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
		path = chroot + (path ? `/${ path }` : '');

		fs.ensureDirSync(path);
		const writeFileSync = Meteor.wrapAsync(fs.writeFile);
		try {
			writeFileSync(`${ path }/${ name }`, blob, encoding);
			success = true;
		} catch (error) {
			console.error('There was an error during saving the file: ', error);
		}
		return success;
	},
	getFile(path: string) {
		const buffer = fs.readFileSync(this.path_upload_files + '/' + path);
		const syncFromFile = Meteor.wrapAsync(detect.fromFile);
		const mime = syncFromFile(this.path_upload_files + '/' + path);
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
			fs.ensureDirSync(`${this.path_upload_files}/${ path }`);
			const base64EncodedImageString = base64file.split(';base64,').pop();
			// @ts-ignore
			const mimeType = base64file.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
			const filename = `${ name }${ Utilities.generateNumberToken(10, 99) }.${ mimeTypes.detectExtension(mimeType) }`;
			const fileUrl = `${ process.env.ROOT_URL }/api/v1/${ path }/${ filename }`;
			await new Promise((resolve,reject) => {
				fs.writeFile(`${this.path_upload_files}/${ path }/${ filename }`, base64EncodedImageString, encoding, (err) => {
					if (err) {
						reject(`Failed to save file: ${ err }`);
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
		const filename = `${ name }${ Utilities.generateNumberToken(10, 99) }.${ mimeTypes.detectExtension(mimeType) }`;
		const file = firebaseAdminStorage.file(`${ path }/${ filename }`);
		const fileUrl = `${ BASE_URL_STORAGE }/${ firebaseAdminStorage.name }/${ path }/${ filename }`;
		try {
			await file.save(fileBuffer, {
				metadata: {
					contentType: mimeType
				},
				public: true,
				validation: false
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
	async saveBinnacleFromBufferToGoogleStorage(fileBuffer: any, name: string) {
		const responseMessage = new ResponseMessage();
		const filename = `${ name }.csv`;
		const file = firebaseAdminStorage.file(`binnacles/${ filename }`);
		const fileUrl = `${ BASE_URL_STORAGE }/${ firebaseAdminStorage.name }/binnacles/${ filename }`;
		try {
			await file.save(fileBuffer, {
				metadata: {
					contentType: 'csv'
				},
				public: false,
				validation: false
			});
			responseMessage.create('Binnacle backup uploaded', undefined, { success: true, fileUrl });
		} catch (exception) {
			console.error('Error uploading backup binnacle to Google Storage: ', exception);
			responseMessage.create('There was an error to upload backup binnacle', undefined, { success: false });
		}
		return responseMessage;
	},
	async getBinnacleFromGoogleStorage(fileLocation: string) {
		const responseMessage = new ResponseMessage();
		const file = firebaseAdminStorage.file(fileLocation + '.txt');
		try {
			const existsFile = await file.exists();
			if (existsFile[0]) {
				const apiResponse = await file.download();
				responseMessage.create('Binnacle exist', undefined, { success: true, binnacle: apiResponse[0] });
			} else {
				responseMessage.create('Binnacle doesnt exist', undefined, { success: false });
			}
		} catch (exception) {
			console.error('Error getting binnacle: ', exception);
			responseMessage.create('There was an error getting binnacle', undefined, { success: false });
		}
		return responseMessage;

	},
	async saveBinnacle(content: string, name: string, exist: boolean) {
		const responseMessage = new ResponseMessage();
		try {
			const dir = `/${ this.path_binnacle_files }/${ name }.csv`;
			const result = await Promise.resolve(new Promise(resolve => {
				if (!exist) {
					fs.outputFile(dir, content, {
						mode: 4744
					}, (err) => {
						if (err) {
							console.log('Error output file: ', err);
							resolve(false);
						} else {
							resolve(true);
						}
					});
				} else {
					fs.appendFile(dir, content, {
						mode: 4744
					}, (err) => {
						if (err) {
							console.log('Error append file: ', err);
							resolve(false);
						} else {
							resolve(true);
						}
					});
				}
			}));
			if (result) {
				responseMessage.create('Binnacle saved', undefined, { success: true });
			} else {
				responseMessage.create('There was an error to saving binnacle', undefined, { success: false });
			}
		} catch (exception) {
			console.error('Error writing binnacle: ', exception);
			responseMessage.create('There was an error to writing binnacle', undefined, { success: false });
		}
		return responseMessage;
	},
	async binnacleExist(filename: string) {
		const responseMessage = new ResponseMessage();
		try {
			const result = await Promise.resolve(new Promise(resolve => {
				fs.access(`/${ this.path_binnacle_files }/${ filename }.csv`, fs.constants.F_OK, (err) => {
					if (err) {
						resolve(false);
					} else {
						resolve(true);
					}
				});
			}));
			if (result) {
				responseMessage.create('Binnacle exist', undefined, { success: true });
			} else {
				responseMessage.create('Binnacle doesnt exist', undefined, { success: false });
			}
		} catch (exception) {
			console.error('Error getting binnacle: ', exception);
			responseMessage.create('There was an error getting binnacle', undefined, { success: false });
		}
		return responseMessage;
	},
	async getBinnacleBuffer(filename: string) {
		const responseMessage = new ResponseMessage();
		try {
			const result: { status: boolean, data: any } = await Promise.resolve(new Promise(resolve => {
				fs.readFile(`/${ this.path_binnacle_files }/${ filename }.csv`, (err, data) => {
					if (err) {
						resolve({
							status: false,
							data: null
						});
					} else {
						resolve({
							status: true,
							data: data
						});
					}
				});
			}));
			if (result.status) {
				responseMessage.create('Binnacle exist', undefined, { success: true, bufferData: result.data });
			} else {
				responseMessage.create('Binnacle doesnt exist', undefined, { success: false });
			}
		} catch (exception) {
			console.error('Error getting binnacle: ', exception);
			responseMessage.create('There was an error getting binnacle', undefined, { success: false });
		}
		return responseMessage;
	},
	/**
	 * Remove a file or directory synchronously.
	 * @param path
	 */
	remove(path: string) {
		if (path) {
			path = `${ this.path_upload_files }/${ path }`;
			fs.removeSync(path);
		}
	}
};
