import 'reflect-metadata';
import { Container } from '../utils/container';
import { ForwardRef } from '../utils/forward-ref';
import { getInjectTokens, InjectToken } from './inject.decorator';

export function Injectable() {
    return function (target: any) {
        // Get the constructor parameters
        const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
        
        const injectTokens = getInjectTokens(target);
        // Create a factory function that will create instances with dependencies (other services)
        const factory = () => {
            const args = paramTypes.map((type: any, index: number) => {
                const injectionToken = resolveInjectionToken(type, injectTokens[index], target.name, index);
                // Get the module's container from the prototype chain
                let current = target;
                while (current && !current.__container) {
                    current = Object.getPrototypeOf(current);
                }
                const container = current?.__container || Container;
                return container.get(injectionToken);
            });
            return new target(...args);
        };

        // Register the factory in the container
        let current = target;
        while (current && !current.__container) {
            current = Object.getPrototypeOf(current);
        }
        const container = current?.__container || Container;
        container.register(target.name, factory);

        return target;
    };
}

function resolveInjectionToken(
    reflectedType: any,
    customToken: InjectToken | undefined,
    targetName: string,
    index: number
): string {
    if (customToken) {
        return unwrapToken(customToken);
    }
    if (!reflectedType) {
        throw new Error(
            `Cannot resolve dependency for ${targetName}. Parameter at index ${index} is undefined. ` +
            'Consider using @Inject with forwardRef to resolve circular dependencies.'
        );
    }
    return reflectedType.name;
}

function unwrapToken(token: InjectToken): string {
    if (typeof token === 'string') {
        return token;
    }
    if (token instanceof ForwardRef) {
        return token.get().name;
    }
    return token().name;
}
