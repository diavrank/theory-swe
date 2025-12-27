import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { RequestDto } from "meteorjs-decorators";
import { UserRequestDto } from "./user-request.dto";

export class SaveUserRequestDto extends RequestDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UserRequestDto)
    user: UserRequestDto;

    @IsString()
    @IsOptional()
    photoFileUser?: string;
}
