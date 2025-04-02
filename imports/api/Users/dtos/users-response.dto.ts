import {ResponseDto} from "../../../shared/dtos/response.dto";
import {UserEntity} from "../user.entity";
import { UserResponseDto } from "./user-response.dto";

export class UsersResponseDto extends ResponseDto {
    data: UserResponseDto[];

    build(users: UserEntity[]): UsersResponseDto {
        this.data = users.map(user => new UserResponseDto().build(user));

        return this.send();
    }
}
