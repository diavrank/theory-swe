import { Container } from '../utils/container';
import { ForwardRef } from '../utils/forward-ref';

export function Inject(token: string | (() => any) | ForwardRef<any>) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number): void {
        const originalConstructor = target.constructor;
        
        // Create a new constructor that injects dependencies
        const newConstructor = function (...args: any[]) {
            // Get the token
            let injectionToken: string;
            if (token instanceof ForwardRef) {
                injectionToken = token.get().name;
            } else if (typeof token === 'string') {
                injectionToken = token;
            } else {
                injectionToken = token().name;
            }
            
            // Get the instance from container
            const instance = Container.get(injectionToken);
            
            // Replace the parameter with the injected instance
            args[parameterIndex] = instance;
            
            // Call the original constructor with injected dependencies
            return new originalConstructor(...args);
        };
        
        // Copy prototype
        newConstructor.prototype = originalConstructor.prototype;
        
        // Replace the original constructor
        target.constructor = newConstructor;
    };
} 