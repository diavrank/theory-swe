import { Mongo } from 'meteor/mongo';
import { Entity, Index } from '/imports/common/decorators/entity.decorator';
import { BaseEntity } from '/imports/common/entities/base.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  static collection: Mongo.Collection<Profile>;

  _id: string;

  @Index({ name: 1 }, { unique: true, name: 'name' })
  name: string;

  description: string;
  permissions: string[];
}
