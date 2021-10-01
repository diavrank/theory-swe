import { Meteor } from 'meteor/meteor';
import { ProfileCollection, ProfileType } from './Profile';
import { StaticProfiles } from './ProfileSeeder';
import { Roles } from 'meteor/alanning:roles';

export default {
	validateName(name: string, profileId: string) {
		const errorMessage = 'Sorry! The new profile name already exists, please use another.';
		const existsName = ProfileCollection.findOne({ name });
		if (profileId) {
			const oldProfile = ProfileCollection.findOne(profileId);
			if (oldProfile?.name !== name && existsName) {
				throw new Meteor.Error('403', errorMessage);
			}
		} else if (existsName) {
			throw new Meteor.Error('403', errorMessage);
		}
	},
	setUserRoles(userId: string, profileName: string) {
		const profile = <ProfileType>ProfileCollection.findOne({ name: profileName });
		// @ts-ignore
		Meteor.roleAssignment.remove({ 'user._id': userId });//For remove other profiles-roles
		Roles.setUserRoles(userId, profile?.permissions, profileName);
	},
	getUsersByProfile(profileId: string) {
		const profile = ProfileCollection.findOne(profileId);
		return Meteor.users.find({ 'profile.profile': profile?.name }).fetch();
	},
	getStaticProfileNames() {
		return Object.keys(StaticProfiles).map((staticProfileName: string) => {
			return StaticProfiles[staticProfileName].name;
		});
	},
	getStaticProfilesForExternalUsers() {
		return Object.keys(StaticProfiles)
			.filter(staticProfileName => StaticProfiles[staticProfileName].external)
			.map(staticProfileName => StaticProfiles[staticProfileName].name);
	}
};
