import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RequestDto } from "meteorjs-decorators";

export class UserDeleteRequestDto extends RequestDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    userId?: string;
}
