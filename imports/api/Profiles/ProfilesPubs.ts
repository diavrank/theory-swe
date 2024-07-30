import ProfilesServ from './ProfilesServ';
import { ProfileCollection } from '/imports/api/Profiles/ProfileCollection';
import {Meteor} from "meteor/meteor";

/**
 * @summary List all non static profiles
 * @publication profiles
 *
 */
Meteor.publish('profiles', function() {
	// @ts-ignore
	return ProfileCollection.find({ name: { $nin: ProfilesServ.getStaticProfileNames() } });
});


/**
 * @summary List all profiles which aren't for external users
 * @publication allProfiles
 */
Meteor.publish('allProfiles', function() {
	return ProfileCollection.find({ name: { $nin: ProfilesServ.getStaticProfilesForExternalUsers() } });
});
