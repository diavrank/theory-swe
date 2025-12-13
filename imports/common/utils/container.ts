import { ForwardRef } from './forward-ref';

export interface ContainerAware {
    __container?: ModuleContainer;
}

export class ModuleContainer {
    private instances = new Map<string, any>();
    private factories = new Map<string, () => any>();
    private proxies = new Map<string, any>();
    private resolving = new Set<string>();
    private parent?: ModuleContainer;

    constructor(parent?: ModuleContainer) {
        this.parent = parent;
    }

    set<T>(token: string, value: T | ForwardRef<T>): void {
        this.instances.set(token, value);
    }

    register<T>(token: string, factory: () => T): void {
        this.factories.set(token, factory);
    }

    get<T>(token: string): T {
        if (this.instances.has(token)) {
            const instance = this.instances.get(token);
            if (instance instanceof ForwardRef) {
                return instance.get();
            }
            return instance;
        }

        if (this.resolving.has(token)) {
            return this.getProxy(token);
        }

        if (this.factories.has(token)) {
            this.resolving.add(token);
            const instance = this.factories.get(token)!();
            this.resolving.delete(token);
            this.instances.set(token, instance);
            return instance;
        }

        if (this.parent) {
            return this.parent.get(token);
        }

        return undefined as unknown as T;
    }

    has(token: string): boolean {
        return this.instances.has(token) || this.factories.has(token) || (this.parent?.has(token) ?? false);
    }

    clear(): void {
        this.instances.clear();
        this.factories.clear();
        this.proxies.clear();
        this.resolving.clear();
    }

    private getProxy<T>(token: string): T {
        if (!this.proxies.has(token)) {
            const handler: ProxyHandler<any> = {
                get: (_target, prop) => {
                    const instance = this.instances.get(token);
                    if (!instance) {
                        throw new Error(`Circular dependency detected for token ${token}.`);
                    }
                    const value = instance[prop];
                    return typeof value === 'function' ? value.bind(instance) : value;
                },
                set: (_target, prop, value) => {
                    const instance = this.instances.get(token);
                    if (!instance) {
                        throw new Error(`Circular dependency detected for token ${token}.`);
                    }
                    instance[prop] = value;
                    return true;
                }
            };
            this.proxies.set(token, new Proxy({}, handler));
        }
        return this.proxies.get(token);
    }
}

// Global container for backward compatibility
export class Container {
    private static rootContainer = new ModuleContainer();

    static set<T>(token: string, value: T | ForwardRef<T>): void {
        this.rootContainer.set(token, value);
    }

    static register<T>(token: string, factory: () => T): void {
        this.rootContainer.register(token, factory);
    }

    static get<T>(token: string): T {
        return this.rootContainer.get(token);
    }

    static has(token: string): boolean {
        return this.rootContainer.has(token);
    }

    static createChildContainer(): ModuleContainer {
        return new ModuleContainer(this.rootContainer);
    }
} 
