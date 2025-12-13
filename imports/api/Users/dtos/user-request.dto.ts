import { Type } from "class-transformer";
import { IsEmail, IsOptional, IsString, ValidateNested } from "class-validator";
import { RequestDto } from "/imports/common/dtos/request.dto";

class ProfileDto {
    @IsString()
    profile: string;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    path?: string;
}

export class UserRequestDto extends RequestDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @ValidateNested()
    @Type(() => ProfileDto)
    profile: ProfileDto;
}
