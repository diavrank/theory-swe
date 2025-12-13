
import { User } from "../user.entity";
import { UserResponseDto } from "./user-response.dto";
import { ResponseDto } from "/imports/common/dtos/response.dto";

export class UsersResponseDto extends ResponseDto {
    data: UserResponseDto[];

    build(users: User[]): UsersResponseDto {
        this.data = users.map(user => new UserResponseDto().build(user));

        return this.send();
    }
}
