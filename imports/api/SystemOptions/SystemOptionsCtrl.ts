import { Meteor } from 'meteor/meteor';
import SystemOptions, { SystemOptionType } from './SystemOption';
// @ts-ignore
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';
import { StaticProfiles } from '/imports/api/Profiles/ProfileSeeder';

/**
 * Regresa las opciones del sistema asociadas a un usuario dependiendo de sus permisos.
 */
export const getSystemOptionsMethod = new ValidatedMethod({
    name: 'getSystemOptions',
    validate: null,
    async run(): Promise<SystemOptionType[]> {
        let data: SystemOptionType[] = [];
        if (this.userId) {
            const userLogged = <Meteor.User>await Meteor.users.findOneAsync(this.userId);
            if (userLogged.profile?.profile === StaticProfiles.admin.name) {
                data = SystemOptions.getAllSystemOptions();
            } else {
                data = SystemOptions.getSystemOptionsByUserRoles(
                    await Roles.getRolesForUserAsync(
                        userLogged?._id,
                        userLogged?.profile.profile,
                    ),
                );
            }
        }

        return data;
    },
});
