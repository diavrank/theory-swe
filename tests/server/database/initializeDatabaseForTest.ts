import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Profile } from '/imports/api/Profiles/profile.entity';
import { RefreshPermissionsBackfill } from '/imports/backfills/recurring/RefreshPermissionsBackfill';
import { RefreshStaticProfilesBackfill } from '/imports/backfills/recurring/RefreshStaticProfilesBackfill';

const getCollectionStates = async (): Promise<{ rolesEmpty: boolean; profilesEmpty: boolean }> => {
    const [rolesCount, profilesCount] = await Promise.all([
        Roles.getAllRoles().countAsync(),
        Profile.collection.find({}).countAsync(),
    ]);

    return {
        rolesEmpty: rolesCount === 0,
        profilesEmpty: profilesCount === 0,
    };
};

export const initializeDatabaseForTest = async (): Promise<void> => {
    if (!Meteor.isServer) {
        return;
    }

    const { rolesEmpty, profilesEmpty } = await getCollectionStates();

    if (!rolesEmpty && !profilesEmpty) {
        return;
    }

    if (rolesEmpty) {
        await new RefreshPermissionsBackfill().run();
    }

    if (profilesEmpty) {
        await new RefreshStaticProfilesBackfill().run();
    }
};

before(async function () {
    // max time for this hook, otherwise Mocha will abort as timeout.
    this.timeout?.(20000);
    await initializeDatabaseForTest();
});
