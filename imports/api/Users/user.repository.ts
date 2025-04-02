import { Mongo } from 'meteor/mongo';
import { BaseRepository } from '/imports/common/repositories/base.repository';
import { User } from './user.entity';
import { UserCollection } from './user.collection';

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
