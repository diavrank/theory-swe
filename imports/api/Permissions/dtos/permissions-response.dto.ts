import { RoleType } from '../Permission';
import { PermissionResponseDto } from './permission-response.dto';
import { ResponseDto } from '/imports/common/dtos/response.dto';

export class PermissionsResponseDto extends ResponseDto {
    data: PermissionResponseDto[];

    build(permissions: RoleType[]): PermissionsResponseDto {
        // TODO: create list() helper.
        this.data = permissions.map(permission => new PermissionResponseDto().build(permission));

        return this.send();
    }
}
