import { Meteor, Subscription } from 'meteor/meteor';
import 'reflect-metadata';
import { BasePublication } from '../publications/base.publication';
import { Container, ContainerAware } from '../utils/container';
import { ForwardRef } from '../utils/forward-ref';
import { getInjectTokens, InjectToken } from './inject.decorator';

export function Publication(name: string) {
	return function(constructor: new (...args: any[]) => BasePublication & ContainerAware) {
		const paramTypes = Reflect.getMetadata('design:paramtypes', constructor) || [];
		const injectTokens = getInjectTokens(constructor);

		const resolveContainer = () => {
			let current: typeof constructor & ContainerAware = constructor;
			while (current && !current.__container) {
				current = Object.getPrototypeOf(current);
			}
			return current?.__container || Container;
		};

		const buildInstance = () => {
			const container = resolveContainer();
			const args = paramTypes.map((type: any, index: number) => {
				const injectionToken = resolveInjectionToken(type, injectTokens[index], constructor.name, index);
				return container.get(injectionToken);
			});
			return new constructor(...args);
		};

		Meteor.publish(name, function(...args: any[]) {
			const instance = buildInstance();
			instance.__context = this as Subscription;
			return instance.init(...args);
		});
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
