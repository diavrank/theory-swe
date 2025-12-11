import { RoleType } from '../Permission';
import { ResponseDto } from '/imports/common/dtos/response.dto';
import { PermissionResponseDto } from './permission-response.dto';

export class PermissionsResponseDto extends ResponseDto {
    data: PermissionResponseDto[];

    build(permissions: RoleType[]): PermissionsResponseDto {
        this.data = permissions.map(permission => new PermissionResponseDto().build(permission));

        return this.send();
    }
}
