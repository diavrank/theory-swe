import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { StaticProfiles } from '../../api/Profiles/constants/static-profiles.constant';
import { Profile } from '../../api/Profiles/profile.entity';

export class RefreshStaticProfilesBackfill {
    static readonly backfillName = 'RefreshStaticProfilesBackfill';

    async run(): Promise<void> {
        console.info('[Backfill] Updating static profiles.');

        for (const staticProfileName of Object.keys(StaticProfiles)) {
            const staticProfile = StaticProfiles[staticProfileName];

            await Profile.collection.upsertAsync(
                { name: staticProfile.name },
                {
                    $set: {
                        description: staticProfile.description,
                        permissions: staticProfile.permissions,
                    },
                },
            );

            const users = await Meteor.users
                .find({ 'profile.profile': staticProfile.name })
                .fetchAsync();

            for (const user of users) {
                // @ts-ignore
                await Meteor.roleAssignment.removeAsync({ 'user._id': user._id });

                if (staticProfile.permissions.length) {
                    await Roles.setUserRolesAsync(user._id, staticProfile.permissions, staticProfile.name);
                }
            }
        }
    }
}
