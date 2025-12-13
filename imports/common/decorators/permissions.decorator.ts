import { Roles } from "meteor/alanning:roles";
import { Meteor } from "meteor/meteor";

export function CheckPermissions(...permissions: string[]) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            // TODO: apply Auth validation
            const userId = this.__context.userId;
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
            return originalMethod.apply(this, args); // Call the original method
        };
        return descriptor;
    };
}
