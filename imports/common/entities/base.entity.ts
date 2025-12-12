import { Mongo } from 'meteor/mongo';

export abstract class BaseEntity {
    static collection: Mongo.Collection<any>;
}

export type EntityConstructor<T> = typeof BaseEntity & {
    new (...args: any[]): T;
    collection: Mongo.Collection<T>;
};
