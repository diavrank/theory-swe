import { Meteor, Subscription } from 'meteor/meteor';
import 'reflect-metadata';
import { ResponseDto } from '../dtos/response.dto';
import { Type } from '../types/type.interface';

export function ReactiveDto(dto: Type<ResponseDto>) {
	return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = function(...args: any[]) {
			const cursor = originalMethod.apply(this, args);
			const subscription: Subscription | undefined = this?.__context;

			if (!subscription || !cursor || typeof cursor.observe !== 'function') {
				return cursor;
			}

			const collectionName = getCollectionName(cursor);
			if (!collectionName) {
				throw new Meteor.Error('publication-error', 'Cannot resolve collection name for reactive publication.');
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

		return descriptor;
	};
}

function getCollectionName(cursor: any): string | undefined {
	return cursor?._cursorDescription?.collectionName
		|| cursor?._collection?._name
		|| cursor?.collection?._name
		|| cursor?.collectionName
		|| cursor?.name;
}
