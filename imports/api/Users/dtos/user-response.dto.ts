import { User } from "../user.entity";
import { ResponseDto } from "/imports/common/dtos/response.dto";

export class UserResponseDto extends ResponseDto {
    id: string;

    name:string;

    email: string;

    build(user: User): UserResponseDto {
        this.id = user._id;
        this.name= user.name;
        this.email = user.email;


        return this.send();
    }
}
