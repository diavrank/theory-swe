import { Meteor } from 'meteor/meteor';
import 'reflect-metadata';
import { BaseController } from '../controllers/base.controller';
import { Container } from '../utils/container';

export function Controller() {
    return function (constructor: new (...args: any[]) => any) {
        const methods = constructor.prototype.__methods || [];

        // Get the constructor parameters
        const paramTypes = Reflect.getMetadata('design:paramtypes', constructor) || [];
        
        // Create a factory function that will create instances with dependencies
        const factory = () => {
            const args = paramTypes.map((type: any) => {
                return Container.get(type.name);
            });
            return new constructor(...args);
        };

        // Register the factory in the container
        Container.set(constructor.name, factory());

        methods.forEach(({ name, method }: { name: string; method: Function }) => {
            console.log('registering method: ', name);
            Meteor.methods({
                [name]: function (...args: any[]) {
                    // Get the instance from the container
                    const instance = Container.get(constructor.name) as BaseController;
                    // Merge the Meteor method context into the instance
                    instance.__context = this; // __context now is the meteor context for methods

                    // Call the method with the merged context
                    return method.apply(instance, args);
                },
            });
        });
    };
}
