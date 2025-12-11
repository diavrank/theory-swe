import { Roles } from 'meteor/alanning:roles';
import { CheckPermissionRequestDto } from './dtos/check-permission-request.dto';
import { Injectable } from '/imports/common/decorators/injectable.decorator';

@Injectable()
export class AuthService {
    async checkPermission(request: CheckPermissionRequestDto): Promise<boolean> {
        if (!request.userId || !request.permission) {
            return false;
        }

        const [group] = await Roles.getScopesForUserAsync(request.userId);
        return Roles.userIsInRoleAsync(request.userId, request.permission, group);
    }
}
