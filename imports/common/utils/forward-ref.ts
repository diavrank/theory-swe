export class ForwardRef<T> {
    constructor(private readonly fn: () => T) {}

    get(): T {
        return this.fn();
    }
}

export function forwardRef<T>(fn: () => T): ForwardRef<T> {
    return new ForwardRef(fn);
} 