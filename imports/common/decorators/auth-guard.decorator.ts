import { Meteor } from "meteor/meteor";

export function Auth() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            if(!this.__context.userId){
                throw new Meteor.Error('403', 'Access denied',
                    'You do not have permission to execute this action.');
            }
            return originalMethod.apply(this, args); // Call the original method
        };
        return descriptor;
    };
}
