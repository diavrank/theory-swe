import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

/**
 * Verify that the user has permission to perform the requested action.
 * @returns {boolean} true if the user has the permission, otherwise false
 * @param methodArgs Method Arguments
 * @param methodOptions Method options
 */
const checkPermission: (this: Meteor.MethodThisType, ...args: any[]) => any = function(methodArgs: any, methodOptions: any): any {
	const userId = this.userId;
	const permissions = methodOptions.permissions;
	let hasPermission = false;
	if (userId !== null) {
		// @ts-ignore
		const scope = Roles.getScopesForUser(userId)[0];
		hasPermission = Roles.userIsInRole(userId, permissions, scope);
	}
	if (!hasPermission) {
		throw new Meteor.Error('403', 'Access denied',
			'You do not have permission to execute this action.');
	}
	return methodArgs;
};

const isUserLogged: (this: Meteor.MethodThisType, ...args: any[]) => any = function(methodArgs: any): any {
	if (!this.userId) {
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
	run(userData: { userId: string, permission: string }) {
		let response = false;
		if (userData.userId && userData.permission) {
			// @ts-ignore
			const group = Roles.getScopesForUser(userData.userId)[0];
			response = Roles.userIsInRole(userData.userId, userData.permission, group);
		}
		return response;
	}
});

export default { checkPermission, isUserLogged };
