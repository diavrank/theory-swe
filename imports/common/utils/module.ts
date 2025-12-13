import 'reflect-metadata';
import { Container, ContainerAware } from './container';

export function Module(config: {
    imports?: any[];
    providers?: any[];
    controllers?: any[];
}) {
    return function (target: any) {
        // Create a container for this module
        const moduleContainer = Container.createChildContainer();
        
        // Handle imports first
        if (config.imports) {
            config.imports.forEach(importedModule => {
                // Don't instantiate modules directly, just register them
                if (importedModule.forwardRef) {
                    console.log('importedModule4: ', importedModule.forwardRef.get());
                    moduleContainer.set(importedModule.forwardRef.get().name, importedModule.forwardRef.get());
                } else {
                    moduleContainer.set(importedModule.name, importedModule);
                }
            });
        }

        const resolveProvider = (providerClass: any) => {
            if (Container.has(providerClass.name)) {
                moduleContainer.set(providerClass.name, Container.get(providerClass.name));
                return;
            }
            const paramTypes = Reflect.getMetadata('design:paramtypes', providerClass) || [];
            const args = paramTypes.map((type: any) => moduleContainer.get(type.name));
            moduleContainer.set(providerClass.name, new providerClass(...args));
        };

        // Then handle providers
        if (config.providers) {
            config.providers.forEach(provider => {
                if (typeof provider === 'function') {
                    resolveProvider(provider);
                } else if (provider.forwardRef) {
                    resolveProvider(provider.forwardRef.get());
                }
            });
        }

        // Handle controllers
        if (config.controllers) {
            config.controllers.forEach(controller => {
                if (typeof controller === 'function') {
                    let instance: any;
                    if (Container.has(controller.name)) {
                        instance = Container.get(controller.name);
                    } else {
                        const paramTypes = Reflect.getMetadata('design:paramtypes', controller) || [];
                        const args = paramTypes.map((type: any) => moduleContainer.get(type.name));
                        instance = new controller(...args);
                    }
                    moduleContainer.set(controller.name, instance);
                    (controller as ContainerAware).__container = moduleContainer;
                }
            });
        }

        // Store the container in the module class
        target.__container = moduleContainer;
    };
} 
