import { Roles } from 'meteor/alanning:roles';
import { CheckPermissionRequestDto } from './dtos/check-permission-request.dto';
import { Injectable } from 'meteorjs-decorators';

@Injectable()
export class AuthService {
    async checkPermission(userId: string, request: CheckPermissionRequestDto): Promise<boolean> {
        if (!userId || !request.permission) {
            return false;
        }

        const [group] = await Roles.getScopesForUserAsync(userId);

        return Roles.userIsInRoleAsync(userId, request.permission, group);
    }
}
