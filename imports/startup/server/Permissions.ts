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
		LIST: { VALUE: 'permissions-view', TEXT: 'Listar permisos' }
	},
	USERS: {
		LIST: { VALUE: 'users-view', TEXT: 'Listar usuarios' },
		CREATE: { VALUE: 'users-create', TEXT: 'Crear usuario' },
		UPDATE: { VALUE: 'users-edit', TEXT: 'Actualizar usuario' },
		DELETE: { VALUE: 'users-delete', TEXT: 'Eliminar usuario' }
	},
	PROFILES: {
		LIST: { VALUE: 'profiles-view', TEXT: 'Listar perfiles' },
		CREATE: { VALUE: 'profiles-create', TEXT: 'Crear perfil' },
		UPDATE: { VALUE: 'profiles-edit', TEXT: 'Actualizar perfil' },
		DELETE: { VALUE: 'profiles-delete', TEXT: 'Eliminar perfil' }
	},
	PLAYERS: {
		LIST: { VALUE: 'players-view', TEXT: 'Listar jugadores' },
		DETAIL: { VALUE: 'players-detail', TEXT: 'Detalle del jugador' },
		GET_COUNT: { VALUE: 'players-get-count', TEXT: 'Conteo de jugadores' }
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
			if (!currentRoles.find(_role => _role._id === permission.VALUE)) {
				Roles.createRole(permission.VALUE);
			}
			Meteor.roles.update(permission.VALUE, {
				$set: {
					publicName: permission.TEXT
				}
			});
		}
	}
}
export default Permissions;
