import { Meteor } from 'meteor/meteor';

export function Controller() {
    return function (constructor: Function) {
        const methods = constructor.prototype.__methods || [];

        methods.forEach(({ name, method }: { name: string; method: Function }) => {
            Meteor.methods({
                [name]: function (...args: any[]) {
                    // Create a new instance of the controller if needed
                    const instance = new constructor();
                    // Merge the Meteor method context into the instance
                    instance.__context = this; // __context now is the meteor context for methods

                    // Call the method with the merged context
                    return method.apply(instance, args);
                },
            });
        });
    };
}
