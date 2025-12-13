import { Roles } from "meteor/alanning:roles";
import { Meteor } from "meteor/meteor";
import { permissionsArray } from "../../api/Permissions/helpers/permissions.helpers";

// TODO: Fix the --settings option from yarn start, it's not working. Create a backfill for new permissions.
if (process.env.REFRESH_PERMISSIONS === 'true' || Meteor.isAppTest) {
    console.info('Updating permissions.');
    const currentRoles = await Roles.getAllRoles().fetchAsync();
    for (let permission of permissionsArray) {
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