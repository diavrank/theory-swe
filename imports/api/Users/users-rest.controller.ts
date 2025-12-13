import express, { Request, Response } from 'express';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import multer from 'multer';
import 'reflect-metadata';
import { Get, JsonController, Param, Post, QueryParam, Req, Res, UseBefore, useExpressServer } from 'routing-controllers';
import fileHelper from '../../startup/server/utils/FileOperations';

const upload = multer({ storage: multer.memoryStorage() });
const API_BASE_PATH = '/api';

const getAuthenticatedUserId = async (req: Request) => {
	const userId = req.headers['x-user-id'] as string | undefined;
	const token = req.headers['x-auth-token'] as string | undefined;

	if (!userId || !token) {
		return null;
	}

	const hashedToken = Accounts['_hashLoginToken'](token);
	const user = await Meteor.users.findOneAsync({
		_id: userId,
		'services.resume.loginTokens.hashedToken': hashedToken
	});

	return user ? userId : null;
};

@JsonController()
class UsersRestController {
	@Get('/testJson')
	async testJson(@Req() req: Request, @Res() res: Response) {
		const userId = await getAuthenticatedUserId(req);
		if (!userId) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		return { hello: 'world' };
	}

	@Get('/users/:userId/avatar/:filename')
	async getUserFile(@Param('userId') userId: string, @Param('filename') filename: string, @Res() res: Response) {
		const decodedUserId = decodeURIComponent(userId);
		const decodedFilename = decodeURIComponent(filename);
		const path = `users/${decodedUserId}/${decodedFilename}`;

		try {
			const file = await fileHelper.getFile(path);
			res.setHeader('Content-disposition', `filename=${decodedFilename}`);
			res.setHeader('Content-length', file.data.length);
			res.setHeader('Content-Type', file.meta.mime);
			return res.status(200).send(file.data);
		} catch (exception) {
			console.error('Error during get the file: ', exception);
			return res.status(404).json({ message: 'Not found' });
		}
	}

	@Get('/testUploadFile')
	async getTestUploadFile(@QueryParam('filename') filename: string | null, @Res() res: Response) {
		if (!filename) {
			return {};
		}

		try {
			const file = await fileHelper.getFile(`testFiles/${filename}`);
			res.setHeader('Content-disposition', `filename=${filename}`);
			res.setHeader('Content-length', file.data.length);
			res.setHeader('Content-Type', file.meta.mime);
			return res.status(200).send(file.data);
		} catch (error) {
			console.error('Error during get the file: ', error);
			return res.status(500).json({ message: 'Error during get the file' });
		}
	}

	@Post('/testUploadFile')
	@UseBefore(upload.any())
	uploadTestFile(@Req() req: Request, @Res() res: Response) {
		const files = (req.files || []) as Express.Multer.File[];
		if (!files.length) {
			return {};
		}

		const file = files[0];
		const successSavedFile = fileHelper.saveFile(file.buffer, file.originalname, 'testFiles');

		if (successSavedFile) {
			return res.status(201).json({ message: 'File saved!' });
		}

		return res.status(500).json({ message: 'Error saving file' });
	}
}

const expressApp = express();
useExpressServer(expressApp, {
	controllers: [UsersRestController],
	defaultErrorHandler: false
});

expressApp.use((_req, res) => {
	if (res.headersSent) {
		return;
	}
	res.status(404).json({ message: 'Not found' });
});

const meteorizedHandler = Meteor.bindEnvironment((req: any, res: any, next: any) => {
	expressApp(req, res, next);
});

WebApp.handlers.use(API_BASE_PATH, meteorizedHandler);
