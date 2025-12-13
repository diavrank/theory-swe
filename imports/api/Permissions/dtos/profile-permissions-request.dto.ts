import { IsNotEmpty, IsString } from 'class-validator';
import { RequestDto } from '/imports/common/dtos/request.dto';

export class ProfilePermissionsRequestDto extends RequestDto {
    @IsString()
    @IsNotEmpty()
    profileId: string;
}
