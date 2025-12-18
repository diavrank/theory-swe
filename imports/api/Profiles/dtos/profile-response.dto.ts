import { type Profile } from "../profile.entity";
import { ResponseDto } from "/imports/common/dtos/response.dto";

export class ProfileResponseDto extends ResponseDto {
    id: string;
    name: string;
    description: string;
    permissions: string[];

    build(profile: Profile): ProfileResponseDto {
        this.id = profile._id;
        this.name = profile.name;
        this.description = profile.description;
        this.permissions = profile.permissions;

        return this.send();
    }
}
