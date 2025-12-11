import { RoleType } from '../Permission';
import { ResponseDto } from '/imports/common/dtos/response.dto';

export class PermissionResponseDto extends ResponseDto {
    _id: string;
    name: string;
    publicName: string;
    children: Array<object>;
    scope?: string;

    build(permission: RoleType): PermissionResponseDto {
        this._id = permission._id;
        this.name = permission.name;
        this.publicName = permission.publicName;
        this.children = permission.children;
        this.scope = permission.scope;

        return this.send();
    }
}
