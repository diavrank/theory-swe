import { IsNotEmpty, IsString } from 'class-validator';
import { RequestDto } from 'meteorjs-decorators';

export class CheckPermissionRequestDto extends RequestDto {
    @IsString()
    @IsNotEmpty()
    permission: string;
}
