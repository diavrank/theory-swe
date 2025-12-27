
import { type User } from "../user.entity";
import { UserResponseDto } from "./user-response.dto";
import { ResponseDto } from "meteorjs-decorators";

export class UsersResponseDto extends ResponseDto {
    data: UserResponseDto[];

    build(users: User[]): UsersResponseDto {
        this.data = users.map(user => new UserResponseDto().build(user));

        return this.send();
    }
}
