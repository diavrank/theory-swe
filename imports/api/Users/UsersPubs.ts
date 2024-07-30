import { Meteor } from 'meteor/meteor';
import ProfilesServ from '../Profiles/ProfilesServ';


/**
 * @summary List all internal users
 * @publication users
 */
Meteor.publish('users', function() {
	return Meteor.users.find({ 'profile.profile': { $nin: ProfilesServ.getStaticProfilesForExternalUsers() } });
});
