import { Profile } from './Profile';
import { PermissionMiddleware } from '../../middlewares/PermissionMiddleware';
import Permissions from '../../startup/server/Permissions';
import ProfilesServ from './ProfilesServ';
import { LoggedUserMiddleware } from '../../middlewares/LoggedUserMiddleware';
// @ts-ignore
import { PublishEndpoint } from 'meteor/peerlibrary:middleware';

/**
 * @summary List all non static profiles
 * @publication profiles
 *
 */
const profilesPublication = new PublishEndpoint('profiles', function() {
	return Profile.find({ name: { $nin: ProfilesServ.getStaticProfileNames() } });
});

profilesPublication.use(new PermissionMiddleware([Permissions.PROFILES.LIST.VALUE]));

/**
 * @summary List all profiles which aren't for external users
 * @publication allProfiles
 */
const allProfilesPublication = new PublishEndpoint('allProfiles', function() {
	return Profile.find({ name: { $nin: ProfilesServ.getStaticProfilesForExternalUsers() } });
});

allProfilesPublication.use(new LoggedUserMiddleware());