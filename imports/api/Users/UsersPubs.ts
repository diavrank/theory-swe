import { Meteor } from 'meteor/meteor';
import { PermissionMiddleware } from '../../middlewares/PermissionMiddleware';
import Permissions from '../../startup/server/Permissions';
import ProfilesServ from '../Profiles/ProfilesServ';
// @ts-ignore
import { PublishEndpoint } from 'meteor/peerlibrary:middleware';

/**
 * @summary List all internal users
 * @publication users
 */
const usersPublication = new PublishEndpoint('users', function() {
	return Meteor.users.find({ 'profile.profile': { $nin: ProfilesServ.getStaticProfilesForExternalUsers() } });
});

usersPublication.use(new PermissionMiddleware([Permissions.USERS.LIST.VALUE]));