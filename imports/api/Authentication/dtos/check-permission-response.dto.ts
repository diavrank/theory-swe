import { ResponseDto } from '/imports/common/dtos/response.dto';

export class CheckPermissionResponseDto extends ResponseDto {
    hasPermission: boolean;

    build(hasPermission: boolean): CheckPermissionResponseDto {
        this.hasPermission = hasPermission;
        
        return this.send();
    }
}
