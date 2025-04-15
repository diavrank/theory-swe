import { Meteor } from 'meteor/meteor';
import { ProfilesService } from '../Profiles/profiles.service';
import { UserRepository } from './user.repository';

/**
 * @summary List all internal users
 * @publication users
 */
Meteor.publish('users', function() {
	const userRepository = new UserRepository();
	const profilesService = new ProfilesService(null as any); // UserService not needed for getStaticProfilesForExternalUsers()

	return userRepository.findAll({ 'profile.profile': { $nin: profilesService.getStaticProfilesForExternalUsers() } });
});
