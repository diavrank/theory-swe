import { ResponseDto } from "./response.dto";

export class DeleteResponse extends ResponseDto {
    status: number;

    message: string;

    build(): DeleteResponse {

        this.status = 200;
        this.message = 'Record deleted!';

        return this.send();
    }
}