import { Meteor } from 'meteor/meteor';
import 'reflect-metadata';
import { BaseController } from '../controllers/base.controller';
import { Container, ContainerAware } from '../utils/container';

export function Controller() {
    return function (constructor: new (...args: any[]) => any & ContainerAware) {
        const methods = constructor.prototype.__methods || [];

        // Get the constructor parameters
        const paramTypes = Reflect.getMetadata('design:paramtypes', constructor) || [];
        
        // Create a factory function that will create instances with dependencies (services)
        const factory = () => {
            const args = paramTypes.map((type: any) => {
                // Get the module's container from the prototype chain
                let current: typeof constructor & ContainerAware = constructor;
                while (current && !current.__container) {
                    current = Object.getPrototypeOf(current);
                }
                const container = current?.__container || Container;
                return container.get(type.name);
            });
            return new constructor(...args);
        };

        // Register the controller in the container
        let current: typeof constructor & ContainerAware = constructor;
        while (current && !current.__container) {
            current = Object.getPrototypeOf(current);
        }
        const container = current?.__container || Container;
        container.register(constructor.name, factory);

        methods.forEach(({ name, method }: { name: string; method: Function }) => {
            console.log('registering method: ', name);
            Meteor.methods({
                [name]: function (...args: any[]) {
                    // Get the instance from the container
                    let current: typeof constructor & ContainerAware = constructor;
                    while (current && !current.__container) {
                        current = Object.getPrototypeOf(current);
                    }
                    const container = current?.__container || Container;
                    const instance = container.get(constructor.name) as BaseController;
                    // Merge the Meteor method context into the instance
                    instance.__context = this; // __context now is the meteor context for methods

                    // Call the method with the merged context
                    return method.apply(instance, args);
                },
            });
        });
    };
}
