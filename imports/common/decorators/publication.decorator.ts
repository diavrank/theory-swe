import { Meteor, Subscription } from 'meteor/meteor';
import 'reflect-metadata';
import { ResponseDto } from '../dtos/response.dto';
import { BasePublication } from '../publications/base.publication';
import { Type } from '../types/type.interface';
import { Container, ContainerAware } from '../utils/container';
import { ForwardRef } from '../utils/forward-ref';
import { getInjectTokens, InjectToken } from './inject.decorator';
import { getPublishDto } from './publish-dto.decorator';

export function Publication(name: string) {
	return function(constructor: new (...args: any[]) => BasePublication & ContainerAware) {
		const paramTypes = Reflect.getMetadata('design:paramtypes', constructor) || [];
		const injectTokens = getInjectTokens(constructor);
		const dto = getPublishDto(constructor);

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
			const result = instance.init(...args);

			if (!dto) {
				return result;
			}

			return publishCursorWithDto(name, this, result, dto);
		});
	};
}

function publishCursorWithDto(
	publicationName: string,
	subscription: Subscription,
	cursor: any,
	dto: Type<ResponseDto>
) {
	if (!cursor || typeof cursor.observe !== 'function') {
		return cursor;
	}

	const collectionName = getCollectionName(cursor);
	if (!collectionName) {
		throw new Meteor.Error('publication-error', `Cannot resolve collection name for publication "${publicationName}".`);
	}

	const toDto = (doc: any) => new dto().build(doc);

	const handle = cursor.observe({
		added(doc) {
			subscription.added(collectionName, doc._id, toDto(doc));
		},
		changed(newDoc) {
			subscription.changed(collectionName, newDoc._id, toDto(newDoc));
		},
		removed(oldDoc) {
			subscription.removed(collectionName, oldDoc._id);
		},
	});

	subscription.onStop(() => {
		if (typeof handle?.stop === 'function') {
			handle.stop();
		}
	});
	subscription.ready();
};

function getCollectionName(cursor: any): string | undefined {
	return cursor?._cursorDescription?.collectionName
		|| cursor?._collection?._name
		|| cursor?.collection?._name
		|| cursor?.collectionName
		|| cursor?.name;
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
