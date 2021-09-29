import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { Roles } from 'meteor/alanning:roles';

export interface PermissionType {
	VALUE: string,
	TEXT: string
}

export interface PermissionsType {
	[key: string]: PermissionType;
}

export interface SystemModulesType {
	[key: string]: PermissionsType;
}

/**
 * Permissions used in the system
 * @type {string[]}
 */
const Permissions: SystemModulesType = {
	PERMISSIONS: {
		LIST: { VALUE: 'permissions-view', TEXT: 'List permissions' }
	},
	USERS: {
		LIST: { VALUE: 'users-view', TEXT: 'List users' },
		CREATE: { VALUE: 'users-create', TEXT: 'Create user' },
		UPDATE: { VALUE: 'users-edit', TEXT: 'Update user' },
		DELETE: { VALUE: 'users-delete', TEXT: 'Remove user' }
	},
	PROFILES: {
		LIST: { VALUE: 'profiles-view', TEXT: 'List profiles' },
		CREATE: { VALUE: 'profiles-create', TEXT: 'Create profile' },
		UPDATE: { VALUE: 'profiles-edit', TEXT: 'Update profile' },
		DELETE: { VALUE: 'profiles-delete', TEXT: 'Remove profile' }
	}
};

export const permissionsArray = Object.keys(Permissions).reduce((accumulator: PermissionType[], systemModuleName: string) => {
	const systemModuleObject: PermissionsType = Permissions[systemModuleName];
	const modulePermissions: PermissionType[] = Object.keys(systemModuleObject).map(permissionName => systemModuleObject[permissionName]);
	return accumulator.concat(modulePermissions);
}, []);

if (Meteor.isDevelopment) {
	if (Meteor.settings.private?.REFRESH_PERMISSIONS) {
		console.info('Updating permissions.');
		const currentRoles = Roles.getAllRoles().fetch();
		for (let permission of permissionsArray) {
			// @ts-ignore
			if (!currentRoles.find(_role => _role._id === permission.VALUE)) {
				Roles.createRole(permission.VALUE);
			}
			// @ts-ignore
			Meteor.roles.update(permission.VALUE, {
				$set: {
					publicName: permission.TEXT
				}
			});
		}
	}
}
export default Permissions;
