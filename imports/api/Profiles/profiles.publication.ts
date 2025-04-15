import { Meteor } from "meteor/meteor";
import { ProfileRepository } from './profile.repository';
import { ProfilesService } from './profiles.service';

/**
 * @summary List all non static profiles
 * @publication profiles
 *
 */
Meteor.publish('profiles', function() {

	const profileRepository = new ProfileRepository();
	const profilesService = new ProfilesService(null as any);
	return profileRepository.findAll({ name: { $nin: profilesService.getStaticProfileNames() } });
});


/**
 * @summary List all profiles which aren't for external users
 * @publication allProfiles
 */
Meteor.publish('allProfiles', function() {
	const profileRepository = new ProfileRepository();
	const profilesService = new ProfilesService(null as any);

	return profileRepository.findAll({ name: { $nin: profilesService.getStaticProfilesForExternalUsers() } });
});
