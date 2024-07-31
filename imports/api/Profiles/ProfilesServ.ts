import { Meteor } from 'meteor/meteor';
import { StaticProfiles } from './ProfileSeeder';
import { Roles } from 'meteor/alanning:roles';
import { ProfileCollection, ProfileType } from '/imports/api/Profiles/ProfileCollection';

export default {
	async validateName(name: string, profileId: string) {
		const errorMessage = 'Sorry! The new profile name already exists, please use another.';
		const existsName = await ProfileCollection.findOneAsync({ name });
		if (profileId) {
			const oldProfile = await ProfileCollection.findOneAsync(profileId);
			if (oldProfile?.name !== name && existsName) {
				throw new Meteor.Error('403', errorMessage);
			}
		} else if (existsName) {
			throw new Meteor.Error('403', errorMessage);
		}
	},
	async setUserRoles(userId: string, profileName: string) {
		const profile = <ProfileType>await ProfileCollection.findOneAsync({ name: profileName });
		// @ts-ignore
		await Meteor.roleAssignment.removeAsync({ 'user._id': userId });//For remove other profiles-roles
		await Roles.setUserRolesAsync(userId, profile?.permissions, profileName);
	},
	async getUsersByProfile(profileId: string) {
		const profile = await ProfileCollection.findOneAsync(profileId);
		return Meteor.users.find({ 'profile.profile': profile?.name }).fetchAsync();
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
	},
	async afterUpdate(event: any) {
		if (event.oldDoc.name !== event.doc.name) {
			await Meteor.users.updateAsync({ 'profile.profile': event.oldDoc.name }, {
				$set: {
					'profile.profile': event.doc.name
				}
			}, { multi: true });
		}
		const users = await Meteor.users.find({ 'profile.profile': event.doc.name }, { fields: { _id: 1 } }).fetchAsync();
		const userIds = users.map(user => user._id);
		// @ts-ignore
		await Meteor.roleAssignment.removeAsync({ 'user._id': { $in: userIds } });
		await Roles.setUserRolesAsync(userIds, event.currentTarget.permissions, event.currentTarget.name);
	}
};
