import { Mongo } from 'meteor/mongo';
import { BaseEntity, Entity, Index } from 'meteorjs-decorators';

@Entity('profiles')
export class Profile extends BaseEntity {
  static collection: Mongo.Collection<Profile>;

  _id: string;

  @Index({ name: 1 }, { unique: true, name: 'name' })
  name: string;

  description: string;
  permissions: string[];
}
