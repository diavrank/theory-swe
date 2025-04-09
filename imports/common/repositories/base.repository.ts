import { StatusCodes } from 'http-status-codes';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export class BaseRepository<T> {
    protected collection: Mongo.Collection<T>;

    constructor(collection: Mongo.Collection<T>) {
        this.collection = collection;
    }

    find(selector: Mongo.Selector<T> = {}, options: Mongo.Options<T> = {}): Promise<T[]> {
        return this.collection.find({ ...selector, $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] }, options).fetchAsync();
    }

    insert(document: Mongo.OptionalId<T>): Promise<string> {
        return this.collection.insertAsync({ ...document, updatedAt: new Date(), deletedAt: null });
    }

    async upsert(
        selector: Mongo.Selector<T> | Mongo.ObjectID | string,
        modifier: Mongo.Modifier<T>,
        options: { multi?: boolean } = {}
    ): Promise<{ numberAffected?: number; insertedId?: string }> {
        if ('$set' in modifier) {
            modifier.$set = { ...modifier.$set, updatedAt: new Date() };
        } else {
            modifier.$set = { updatedAt: new Date() };
        }
        return this.collection.upsertAsync(selector, modifier, options);
    }

    async findOneOrFail(selector: Mongo.Selector<T> | Mongo.ObjectID | string, errorMessage = 'Document not found'): Promise<T> {
        const document = await this.collection.findOneAsync(selector);
        if (!document) {
            throw new Meteor.Error(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
        }
        return document;
    }

    async softDelete(selector: Mongo.Selector<T>): Promise<number> {
        const result = await this.collection.updateAsync(selector, {
            $set: { deletedAt: new Date() },
        });
        return result;
    }

    async restore(selector: Mongo.Selector<T>): Promise<number> {
        const result = await this.collection.updateAsync(selector, {
            $unset: { deletedAt: null },
        });
        return result;
    }
}
