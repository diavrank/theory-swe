import { Meteor } from 'meteor/meteor';
import ProfilesServ from '../Profiles/ProfilesServ';
import { UserRepository } from './user.repository';


/**
 * @summary List all internal users
 * @publication users
 */
Meteor.publish('users', function() {

	const userRepository = new UserRepository();

	return userRepository.findAll({ 'profile.profile': { $nin: ProfilesServ.getStaticProfilesForExternalUsers() } });
});
