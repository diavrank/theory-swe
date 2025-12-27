import { IsNotEmpty, IsString } from 'class-validator';
import { RequestDto } from 'meteorjs-decorators';

export class ProfilePermissionsRequestDto extends RequestDto {
    @IsString()
    @IsNotEmpty()
    profileId: string;
}
