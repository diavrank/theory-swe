import { IsNotEmpty, IsString } from 'class-validator';
import { RequestDto } from '/imports/common/dtos/request.dto';

export class CheckPermissionRequestDto extends RequestDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    permission: string;
}
