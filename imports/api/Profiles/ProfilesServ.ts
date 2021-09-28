import { Meteor } from 'meteor/meteor';
import { Profile, ProfileType } from './Profile';
import { StaticProfiles } from './ProfileSeeder';
// @ts-ignore
import { Roles } from 'meteor/alanning:roles';

export default {
	validateName(name: string, idProfile: string) {
		const existsName = Profile.findOne({ name });
		if (idProfile) {
			const oldProfile = Profile.findOne(idProfile);
			if (oldProfile?.name !== name && existsName) {
				throw new Meteor.Error('403', 'Lo sentimos! Ya existe este nombre de perfil, utiliza otro. ');
			}
		} else if (existsName) {
			throw new Meteor.Error('403', 'Lo sentimos! Ya existe este nombre de perfil, utiliza otro.');
		}
	},
	setUserRoles(idUser: string, profileName: string) {
		const profile = Profile.findOne({ name: profileName });
		Meteor.roleAssignment.remove({ 'user._id': idUser });//For remove other profiles-roles
		Roles.setUserRoles(idUser, profile?.permissions, profileName);
	},
	getUsersByProfile(idProfile: string) {
		const profile = Profile.findOne(idProfile);
		return Meteor.users.find({ 'profile.profile': profile?.name }).fetch();
	},
	updateProfileUsers(users: Array<Meteor.User>, profile: ProfileType) {
		users.forEach((user) => {
			this.setUserRoles(user._id, profile.name);
		});
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