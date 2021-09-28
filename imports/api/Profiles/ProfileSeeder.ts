import { permissionsArray } from '../../startup/server/Permissions';
import { Profile } from './Profile';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Profile.rawCollection().createIndex({ 'name': 1 }, { unique: true });

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
		description: 'Administrador',
		permissions: permissionsArray.map(p => p.VALUE),
		external: false
	},
	player: {
		name: 'player',
		description: 'Jugador',
		permissions: [],
		external: true
	}
};
if (Meteor.isDevelopment) {
	if (Meteor.settings.private?.REFRESH_STATIC_PROFILES) {
		console.log('Updating static profiles.');
		Object.keys(StaticProfiles).forEach((staticProfileName) => {
			Profile.upsert({ name: StaticProfiles[staticProfileName].name }, {
				$set: {
					description: StaticProfiles[staticProfileName].description,
					permissions: StaticProfiles[staticProfileName].permissions
				}
			});
			Meteor.users.find({ 'profile.profile': StaticProfiles[staticProfileName].name }).fetch().forEach(user => {
				Meteor.roleAssignment.remove({ 'user._id': user._id });
				if (StaticProfiles[staticProfileName].permissions.length) {
					Roles.setUserRoles(user._id, StaticProfiles[staticProfileName].permissions, StaticProfiles[staticProfileName].name);
				}
			});
		});
	}
}
