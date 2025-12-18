import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { NpmModuleMongodb } from 'meteor/npm-mongo';
import { type EntityConstructor } from '../entities/base.entity';

type IndexMetadata = {
    indexSpec: Record<string, any>;
    options: Record<string, any>;
};

const indexMetadata = new WeakMap<Function, IndexMetadata[]>();

export function Index(indexSpec: NpmModuleMongodb.IndexSpecification,
    options?: NpmModuleMongodb.CreateIndexesOptions): PropertyDecorator {
    return (target, propertyKey) => {
        const constructor = target.constructor as Function;
        const indexes = indexMetadata.get(constructor) ?? [];
        indexes.push({ indexSpec, options });
        indexMetadata.set(constructor, indexes);
    };
}

export function Entity(collectionName: string, collectionObject?: Mongo.Collection<any>): ClassDecorator {
    return <T extends EntityConstructor<any>>(constructor: T) => {
        const collection = collectionObject ?? new Mongo.Collection(collectionName);
        constructor.collection = collection as Mongo.Collection<any>;

        const indexes = indexMetadata.get(constructor) ?? [];
        if (Meteor.isServer && indexes.length) {
            const rawCollection = constructor.collection.rawCollection();
            indexes.forEach(({ indexSpec, options }) => {
                void rawCollection.createIndex(indexSpec, options);
            });
        }

        return constructor;
    };
}
