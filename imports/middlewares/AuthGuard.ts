import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

/**
 * Verify that the user has permission to perform the requested action.
 * @returns {boolean} true if the user has the permission, otherwise false
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
		throw new Meteor.Error('403', 'Access denied',
			'You do not have permission to execute this action.');
	}
	return methodArgs;
};

const isUserLogged: (this: Meteor.MethodThisType, ...args: any[]) => any = function(methodArgs: any): any {
	const idUserLogged = this.userId;
	if (!idUserLogged) {
		throw new Meteor.Error('403', 'Access denied',
			'You do not have permission to execute this action.');
	}
	return methodArgs;
};

/**
 * METHODS for Client
 */

/**
 *
 * Verify that the user has permission to perform the requested action.
 * @param userData User ID and Permission to check that the user has
 * @returns {boolean} true if the user has the permission, otherwise false
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
