import 'reflect-metadata';
import { Container } from '../utils/container';

export function Injectable() {
    return function (target: any) {
        // Get the constructor parameters
        const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
        
        // Create a factory function that will create instances with dependencies
        const factory = () => {
            const args = paramTypes.map((type: any) => {
                return Container.get(type.name);
            });
            return new target(...args);
        };

        // Register the factory in the container
        Container.set(target.name, factory());

        return target;
    };
} 