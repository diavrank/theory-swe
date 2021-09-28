export class ResponseMessage {

	message?: string;
	description?: string;
	data?: any;

	constructor() {
		this.message = '';
	}

	create(message: string, description?: string, data?: any) {
		this.message = message;
		this.description = description;
		this.data = data;
	}

}
