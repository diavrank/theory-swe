import 'reflect-metadata';
import { Container } from './container';

export function Module(config: {
    imports?: any[];
    providers?: any[];
    controllers?: any[];
}) {
    return function (target: any) {
        // Handle imports first
        if (config.imports) {
            config.imports.forEach(module => {
                // Initialize imported modules
                new module();
            });
        }

        // Then handle providers
        if (config.providers) {
            config.providers.forEach(provider => {
                if (typeof provider === 'function') {
                    // Get the constructor parameters
                    const paramTypes = Reflect.getMetadata('design:paramtypes', provider) || [];
                    // Create instance with dependencies
                    const args = paramTypes.map((type: any) => {
                        return Container.get(type.name);
                    });
                    Container.set(provider.name, new provider(...args));
                } else if (provider.forwardRef) {
                    const providerClass = provider.forwardRef.get();
                    const paramTypes = Reflect.getMetadata('design:paramtypes', providerClass) || [];
                    const args = paramTypes.map((type: any) => {
                        return Container.get(type.name);
                    });
                    Container.set(providerClass.name, new providerClass(...args));
                }
            });
        }

        // Handle controllers
        if (config.controllers) {
            config.controllers.forEach(controller => {
                if (typeof controller === 'function') {
                    // Get the constructor parameters
                    const paramTypes = Reflect.getMetadata('design:paramtypes', controller) || [];
                    // Create instance with dependencies
                    const args = paramTypes.map((type: any) => {
                        return Container.get(type.name);
                    });
                    Container.set(controller.name, new controller(...args));
                }
            });
        }
    };
} 