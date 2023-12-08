import { permissionsArray } from '../../startup/server/Permissions';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { ProfileCollection } from '/imports/api/Profiles/ProfileCollection';

export interface StaticProfileType {
	name: string;
	description: string,
	permissions: string[],
	external: boolean
}

export interface StaticProfilesType {
	[key: string]: StaticProfileType
}

export const StaticProfiles: StaticProfilesType = {
	admin: {
		name: 'admin',
		description: 'Administrator',
		permissions: permissionsArray.map(p => p.VALUE),
		external: false
	}
};
if (Meteor.isDevelopment) {
	if (Meteor.settings.private?.REFRESH_STATIC_PROFILES || Meteor.isAppTest) {
		console.log('Updating static profiles.');
		Object.keys(StaticProfiles).forEach((staticProfileName) => {
			ProfileCollection.upsert({ name: StaticProfiles[staticProfileName].name }, {
				$set: {
					description: StaticProfiles[staticProfileName].description,
					permissions: StaticProfiles[staticProfileName].permissions
				}
			});
			Meteor.users.find({ 'profile.profile': StaticProfiles[staticProfileName].name }).fetch().forEach(user => {
				// @ts-ignore
				Meteor.roleAssignment.remove({ 'user._id': user._id });
				if (StaticProfiles[staticProfileName].permissions.length) {
					Roles.setUserRoles(user._id, StaticProfiles[staticProfileName].permissions, StaticProfiles[staticProfileName].name);
				}
			});
		});
	}
}
