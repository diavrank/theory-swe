import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RequestDto } from "/imports/common/dtos/request.dto";

export class UserDeleteRequestDto extends RequestDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    userId?: string;
}
