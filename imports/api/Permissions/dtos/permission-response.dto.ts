import { RoleType } from '../Permission';
import { ResponseDto } from 'meteorjs-decorators';

export class PermissionResponseDto extends ResponseDto {
    _id: string;
    publicName: string;
    children: Array<object>;
    scope?: string;

    build(permission: RoleType): PermissionResponseDto {
        this._id = permission._id;
        this.publicName = permission.publicName;
        this.children = permission.children;
        // TODO: Validate if it's required in the FE, if not,remove it
        this.scope = permission.scope;

        return this.send();
    }
}
