import { Mongo } from 'meteor/mongo';
import { User } from './user.entity';
import { BaseRepository } from '/imports/common/repositories/base.repository';

export class UserRepository extends BaseRepository<User> {

  constructor() {
    super(User.collection);
  }

  async deleteById(id: string): Promise<number> {
    return this.softDelete({ _id: id });
  }

  async create(user: Mongo.OptionalId<User>): Promise<string> {
    return this.insert(user);
  }

  findUsersTotal({ excludeUserId, externalProfileNames, search }) {
    const selector: Mongo.Selector<User> = {
      _id: { $ne: excludeUserId },
      'profile.profile': { $nin: externalProfileNames }
    };
    if (search) {
      selector.$text = { $search: search };
    }

    return this.findAll(selector, { fields: { _id: 1 } }).countAsync();
  }
}
