import { Roles } from "meteor/alanning:roles";
import { Meteor } from "meteor/meteor";
import { permissionsArray } from "../../api/Permissions/helpers/permissions.helpers";

export class RefreshPermissionsBackfill {
    static readonly backfillName = 'RefreshPermissionsBackfill';

    async run(): Promise<void> {
        console.info('[Backfill] Updating permissions.');

        const currentRoles = await Roles.getAllRoles().fetchAsync();
        for (const permission of permissionsArray) {
            // @ts-ignore
            if (!currentRoles.find((_role) => _role._id === permission.VALUE)) {
                await Roles.createRoleAsync(permission.VALUE);
            }

            // @ts-ignore
            await Meteor.roles.updateAsync(permission.VALUE, {
                $set: {
                    publicName: permission.TEXT,
                },
            });
        }
    }
}
