import { ForwardRef } from './forward-ref';

export class Container {
    private static instances = new Map<string, any>();

    static set<T>(token: string, value: T | ForwardRef<T>): void {
        this.instances.set(token, value);
    }

    static get<T>(token: string): T {
        const instance = this.instances.get(token);
        if (instance instanceof ForwardRef) {
            return instance.get();
        }
        return instance;
    }

    static has(token: string): boolean {
        return this.instances.has(token);
    }
} 