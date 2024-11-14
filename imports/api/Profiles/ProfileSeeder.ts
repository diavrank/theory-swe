import { permissionsArray } from '../../startup/server/Permissions';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ProfileCollection } from '/imports/api/Profiles/ProfileCollection';

export interface StaticProfileType {
    name: string;
    description: string;
    permissions: string[];
    external: boolean;
}

export interface StaticProfilesType {
    [key: string]: StaticProfileType;
}

ProfileCollection.rawCollection().createIndex({ name: 1 }, { unique: true, name: 'name' });

export const StaticProfiles: StaticProfilesType = {
    admin: {
        name: 'admin',
        description: 'Administrator',
        permissions: permissionsArray.map((p) => p.VALUE),
        external: false,
    },
};

if (process.env.REFRESH_STATIC_PROFILES === 'true' || Meteor.isAppTest) {
    console.log('Updating static profiles.');

    for (const staticProfileName of Object.keys(StaticProfiles)) {
        await ProfileCollection.upsertAsync(
            { name: StaticProfiles[staticProfileName].name },
            {
                $set: {
                    description: StaticProfiles[staticProfileName].description,
                    permissions: StaticProfiles[staticProfileName].permissions,
                },
            },
        );
        const users = await Meteor.users
            .find({ 'profile.profile': StaticProfiles[staticProfileName].name })
            .fetchAsync();
        for (const user of users) {
            // @ts-ignore
            await Meteor.roleAssignment.removeAsync({ 'user._id': user._id });
            if (StaticProfiles[staticProfileName].permissions.length) {
                await Roles.setUserRolesAsync(
                    user._id,
                    StaticProfiles[staticProfileName].permissions,
                    StaticProfiles[staticProfileName].name,
                );
            }
        }
    }
}
