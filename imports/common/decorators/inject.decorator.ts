import 'reflect-metadata';
import { ForwardRef } from '../utils/forward-ref';

const INJECT_METADATA_KEY = Symbol('inject_tokens');

export type InjectToken = string | (() => any) | ForwardRef<any>;

export function Inject(token: InjectToken) {
    return function (target: any, _propertyKey: string | symbol, parameterIndex: number): void {
        const existingMetadata: Record<number, InjectToken> =
            Reflect.getMetadata(INJECT_METADATA_KEY, target) || {};
        existingMetadata[parameterIndex] = token;
        Reflect.defineMetadata(INJECT_METADATA_KEY, existingMetadata, target);
    };
}

export function getInjectTokens(target: any): Record<number, InjectToken> {
    return Reflect.getMetadata(INJECT_METADATA_KEY, target) || {};
}
