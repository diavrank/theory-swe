import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { ValidatedMethod } from 'meteor/mdg:validated-method';
// @ts-ignore
import { Roles } from 'meteor/alanning:roles';

/**
 * Verifica que el usuario tenga el permiso para realizar la acción solicitada
 * @returns {boolean} true si tiene el permiso el usuario, false de lo contrario
 * @param methodArgs Method Arguments
 * @param methodOptions Method options
 */
const checkPermission: (this: Meteor.MethodThisType, ...args: any[]) => any = function(methodArgs: any, methodOptions: any): any {
	const idUser = this.userId;
	const permissions = methodOptions.permissions;
	let hasPermission = false;
	if (idUser !== null) {
		const scope = Roles.getScopesForUser(idUser)[0];
		hasPermission = Roles.userIsInRole(idUser, permissions, scope);
	}
	if (!hasPermission) {
		throw new Meteor.Error('403', 'Acceso denegado',
			'No tienes permiso para ejecutar esta acción.');
	}
	return methodArgs;
};

const isUserLogged: (this: Meteor.MethodThisType, ...args: any[]) => any = function(methodArgs: any): any {
	const idUserLogged = this.userId;
	if (!idUserLogged) {
		throw new Meteor.Error('403', 'Acceso denegado',
			'No tienes permiso para ejecutar esta acción.');
	}
	return methodArgs;
};

/**
 * METHODS for Client
 */

/**
 * Para consumo de lado del cliente
 * Verifica que el usuario tenga el permiso para realizar la acción solicitada
 * @param userData Identificador del usuario y Permiso a verificar que tenga el usuario
 * @returns {boolean} true si tiene el permiso el usuario, false de lo contrario
 */
export const checkPermissionMethod = new ValidatedMethod({
	name: 'checkPermission',
	validate: null,
	run(userData: { idUser: string, permission: string }) {
		let response = false;
		if (userData.idUser && userData.permission) {
			const group = Roles.getScopesForUser(userData.idUser)[0];
			response = Roles.userIsInRole(userData.idUser, userData.permission, group);
		}
		return response;
	}
});

export default { checkPermission, isUserLogged };