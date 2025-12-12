import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { type EntityConstructor } from '../entities/base.entity';

type IndexMetadata = {
    field: string;
    options: Record<string, any>;
};

const indexMetadata = new WeakMap<Function, IndexMetadata[]>();

export function Index(options: Record<string, any> = {}): PropertyDecorator {
    return (target, propertyKey) => {
        const constructor = target.constructor as Function;
        const indexes = indexMetadata.get(constructor) ?? [];
        indexes.push({ field: propertyKey as string, options });
        indexMetadata.set(constructor, indexes);
    };
}

export function Entity(collectionName: string): ClassDecorator {
    return <T extends EntityConstructor<any>>(constructor: T) => {
        const collection = new Mongo.Collection(collectionName);
        constructor.collection = collection as Mongo.Collection<any>;

        const indexes = indexMetadata.get(constructor) ?? [];
        if (Meteor.isServer && indexes.length) {
            const rawCollection = constructor.collection.rawCollection();
            indexes.forEach(({ field, options }) => {
                const { name, ...restOptions } = options ?? {};
                void rawCollection.createIndex({ [field]: 1 }, { ...restOptions, name: field });
            });
        }

        return constructor;
    };
}
