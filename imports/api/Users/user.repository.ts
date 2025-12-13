import { Mongo } from 'meteor/mongo';
import { UserCollection } from './user.collection';
import { User } from './user.entity';
import { BaseRepository } from '/imports/common/repositories/base.repository';

export class UserRepository extends BaseRepository<User> {

  constructor() {
    super(UserCollection);
  }

  async deleteById(id: string): Promise<number> {
    return this.softDelete({ _id: id });
  }

  async create(user: Mongo.OptionalId<User>): Promise<string> {
    return this.insert(user);
  }
}
