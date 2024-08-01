import {Meteor} from 'meteor/meteor';
import {createMethod} from 'meteor/jam:method';
import {Roles} from 'meteor/alanning:roles';

/**
 * Verify that the user has permission to perform the requested action.
 * @returns {boolean} true if the user has the permission, otherwise false
 * @param methodArgs Method Arguments
 * @param methodOptions Method options
 * @param permissions Method options
 */

const checkPermission: (permissions: string[]) => (this: Meteor.MethodThisType, ...args: any[]) => any = function (permissions: string[]) {
    return async function (methodArgs: any, methodOptions: any): Promise<any> {
        const userId = this.userId;
        let hasPermission = false;
        if (userId !== null) {
            const [scope] = await Roles.getScopesForUserAsync(userId);
            if (permissions.length !== 0) {
                hasPermission = await Roles.userIsInRoleAsync(userId, permissions, scope);
            }
        }
        if (!hasPermission) {
            throw new Meteor.Error('403', 'Access denied',
                'You do not have permission to execute this action.');
        }
        return methodArgs;
    };
}

const isUserLogged: (this: Meteor.MethodThisType, ...args: any[]) => any = function (methodArgs: any): any {
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
export const checkPermissionMethod = createMethod({
    name: 'checkPermission',
    validate: () => {
    },
    async run(userData: { userId: string, permission: string }) {
        let response = false;
        if (userData.userId && userData.permission) {
            const [group] = await Roles.getScopesForUserAsync(userData.userId);
            response = await Roles.userIsInRoleAsync(userData.userId, userData.permission, group);
        }
        return response;
    }
});

export default {checkPermission, isUserLogged};
