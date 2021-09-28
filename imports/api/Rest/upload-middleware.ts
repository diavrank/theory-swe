// @ts-ignore
import { JsonRoutes } from 'meteor/simple:json-routes';
import Busboy from 'busboy';

// images upload middlware (Restivus handle bad this.done() method, so this is workaround)
JsonRoutes.Middleware.use(function(req: any, _res: any, next: Function) {

	// upload image only on PUT to /users/:id must be presneted authToken and userId header
	if ((req.method === 'PUT' || req.method === 'POST') &&
		req.headers['content-type'].match(/^multipart\/form\-data/)) {

		const busboy = new Busboy({ headers: req.headers });

		// files will be avaliable in request context in endpoints
		req.files = [];
		req.data = {};

		busboy.on('file', function(fieldname: string, file: any, filename: string, encoding: string, mimetype: string) {

			const uploadedFile: any = {
				filename,
				mimetype,
				encoding,
				fieldname,
				data: null
			};

			//console.log('busboy have file...', uploadedFile);
			const buffers: any = [];

			file.on('data', function(data:any) {
				//console.log('data: ', data.length);
				buffers.push(data);
			});
			file.on('end', function() {
				//console.log('EOF');
				uploadedFile.data = Buffer.concat(buffers);
				req.files.push(uploadedFile);
			});
		});

		busboy.on('field', function(fieldName: string, val: any) {
			req.data[fieldName] = val;
		});

		busboy.on('finish', function() {
			//console.log('busboy finish');
			next();
		});

		req.pipe(busboy);
		return;
	}
	next();
});
