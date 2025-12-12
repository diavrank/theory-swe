import { Roles } from 'meteor/alanning:roles';
import { UserService } from '../Users/users.service';
import { StaticProfiles } from './ProfileSeeder';
import { systemOptions, SystemOptionType } from './system-options.constants';
import { Injectable } from '/imports/common/decorators/injectable.decorator';

@Injectable()
export class SystemOptionsService {

    constructor(
        private userService: UserService
      ) {}

    getSystemOptionsByPermissions(permissions: string[]): SystemOptionType[] {
        if (!permissions || permissions.length === 0) {
            return [];
        }

        return systemOptions.filter((option) => {
            if (!option.permission) {
                return true;
            }

            return permissions.includes(option.permission);
        });
    }

    getAllSystemOptions(): SystemOptionType[] {
        return systemOptions;
    }

    async getSystemOptionsByUserId(userId:string):Promise<SystemOptionType[]>{
        const userLogged = await this.userService.getUserById(userId);

        if (userLogged.profile.profile === StaticProfiles.admin.name) {
            return this.getAllSystemOptions();
        }

        const roles = await Roles.getRolesForUserAsync(
            userLogged._id,
            userLogged.profile?.profile,
        );

        return this.getSystemOptionsByPermissions(roles);
    }
}
