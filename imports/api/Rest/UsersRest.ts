import Api from './config';
import fileHelper from '../../startup/server/utils/FileOperations';
import { ResponseEntity } from './ResponseEntity';

Api.addRoute('testJson', { authRequired: true }, {
	get() {
		const responseEntity = new ResponseEntity();
		responseEntity.body = {
			hello: 'world'
		};
		return responseEntity;
	}
});

Api.addRoute('users/:userId/:filename', {}, {
	get() {
		const responseEntity = new ResponseEntity();
		let file = null;
		const path = `users/${ this.urlParams.userId }/${ this.urlParams.filename }`;
		try {
			file = fileHelper.getFile(path);
			responseEntity.statusCode = 200;
			responseEntity.body = file.data;
			responseEntity.headers['Content-disposition'] = 'filename=' + this.urlParams.filename;
			responseEntity.headers['Content-length'] = file.data.length;
			responseEntity.headers['Content-Type'] = file.meta.mime;
		} catch (exception) {
			console.error('Error during get the file: ', exception);
			responseEntity.statusCode = 500;
			responseEntity.body = {
				message: 'Error during get the file'
			};
		}
		return responseEntity;
	}
});

Api.addRoute('testUploadFile', {}, {
	get: function() {
		const responseEntity = new ResponseEntity();
		let file = null;
		const filename = this.queryParams.filename;
		if (filename) {
			try {
				file = fileHelper.getFile('testFiles/' + filename);
				responseEntity.statusCode = 200;
				responseEntity.body = file.data;
				responseEntity.headers['Content-disposition'] = 'filename=' + filename;
				responseEntity.headers['Content-length'] = file.data.length;
				responseEntity.headers['Content-Type'] = file.meta.mime;
			} catch (error) {
				console.error('Error during get the file: ', error);
				responseEntity.statusCode = 500;
				responseEntity.body = {
					message: 'Error during get the file'
				};
			}
		}
		return responseEntity;
	},
	post: function() {
		const responseEntity = new ResponseEntity();
		console.log('User id: ', this.userId);
		console.log('Url params: ', this.urlParams);
		console.log('Query params: ', this.queryParams);
		console.log('Body params: ', this.bodyParams);
		console.log('FormData: ', this.request.data);
		console.log('FormData Files: ', this.request.files);
		if (this.request.files.length > 0) {
			const file = this.request.files[0];
			try {
				const successSavedFile = fileHelper.saveFile(file.data, file.filename, 'testFiles');
				if (successSavedFile) {
					console.log('Finished file saved');
					responseEntity.statusCode = 201;
					responseEntity.body.message = 'File saved!';
				} else {
					responseEntity.statusCode = 500;
					responseEntity.body.message = 'Error saving file';
				}
			} catch (exception) {
				console.error('Error saving file: ', exception);
				responseEntity.statusCode = 500;
				responseEntity.body = {
					message: 'Error saving file',
					details: exception
				};
			}
		}
		return responseEntity;
	}
});
