import { ResponseDto } from 'meteorjs-decorators';

export class CheckPermissionResponseDto extends ResponseDto {
    hasPermission: boolean;

    build(hasPermission: boolean): CheckPermissionResponseDto {
        this.hasPermission = hasPermission;
        
        return this.send();
    }
}
