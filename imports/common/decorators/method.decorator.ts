export function Method(name: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // Store metadata about the method on the class
        if (!target.__methods) {
            target.__methods = [];
        }
        const originalMethod = descriptor.value;

        // Store metadata about the method
        target.__methods.push({
            name,
            method: function (...args: any[]) {
                return originalMethod.apply(this, args);
            },
        });
    };
}
