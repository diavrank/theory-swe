import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { StaticProfiles } from '../../api/Profiles/constants/static-profiles.constant';
import { Profile } from '../../api/Profiles/profile.entity';


// TODO: Convert to a backfill
if (process.env.REFRESH_STATIC_PROFILES === 'true' || Meteor.isAppTest) {
    console.log('Updating static profiles.');

    for (const staticProfileName of Object.keys(StaticProfiles)) {
        await Profile.collection.upsertAsync(
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
