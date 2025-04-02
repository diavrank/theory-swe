import { IsString, IsBoolean, IsOptional, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { RequestDto } from "/imports/common/dtos/request.dto";

class EmailDto {
    @IsString()
    address: string;

    @IsBoolean()
    verified: boolean;
}

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
    _id?: string;

    @IsString()
    username: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EmailDto)
    emails: EmailDto[];

    @ValidateNested()
    @Type(() => ProfileDto)
    profile: ProfileDto;
}
