import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { UserRequestDto } from "./user-request.dto";
import { RequestDto } from "/imports/common/dtos/request.dto";

export class UserUpdatePersonalDataRequestDto extends RequestDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UserRequestDto)
    user: UserRequestDto;

    @IsString()
    @IsOptional()
    photoFileUser?: string;
} 