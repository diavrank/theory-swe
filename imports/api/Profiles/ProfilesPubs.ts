import { PermissionMiddleware } from '../../middlewares/PermissionMiddleware';
import Permissions from '../../startup/server/Permissions';
import ProfilesServ from './ProfilesServ';
import { LoggedUserMiddleware } from '../../middlewares/LoggedUserMiddleware';
import { PublishEndpoint } from 'meteor/peerlibrary:middleware';
import { ProfileCollection } from '/imports/api/Profiles/ProfileCollection';

/**
 * @summary List all non static profiles
 * @publication profiles
 *
 */
const profilesPublication = new PublishEndpoint('profiles', function() {
	return ProfileCollection.find({ name: { $nin: ProfilesServ.getStaticProfileNames() } });
});

profilesPublication.use(new PermissionMiddleware([Permissions.PROFILES.LIST.VALUE]));

/**
 * @summary List all profiles which aren't for external users
 * @publication allProfiles
 */
const allProfilesPublication = new PublishEndpoint('allProfiles', function() {
	return ProfileCollection.find({ name: { $nin: ProfilesServ.getStaticProfilesForExternalUsers() } });
});

allProfilesPublication.use(new LoggedUserMiddleware());
