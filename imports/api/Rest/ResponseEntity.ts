export class ResponseEntity {
	statusCode: number;
	body: any;
	headers: any;

	constructor() {
		this.statusCode = 200;
		this.body = {};
		this.headers = {};
	}
}