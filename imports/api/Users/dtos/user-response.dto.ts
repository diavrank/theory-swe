import { User, UserProfileType } from "../user.entity";
import { ResponseDto } from "/imports/common/dtos/response.dto";

export class UserResponseDto extends ResponseDto {
    id: string;
    username:string;
    email: string;
    createdAt: Date;
    profile: UserProfileType;

    build(user: User): UserResponseDto {
        this.id = user._id;
        this.username= user.username;
        this.email = user.emails[0].address;
        this.createdAt = user.createdAt;
        this.profile = user.profile;

        return this.send();
    }
}
