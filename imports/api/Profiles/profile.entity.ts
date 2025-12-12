import { BaseEntity } from '/imports/common/entities/base.entity';
import { Entity, Index } from '/imports/common/decorators/entity.decorator';
import { Mongo } from 'meteor/mongo';

@Entity('profiles')
export class Profile extends BaseEntity {
  static collection: Mongo.Collection<Profile>;

  _id: string;

  @Index({ unique: true })
  name: string;

  description: string;
  permissions: string[];
}
