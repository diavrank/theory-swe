import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Entity, Index } from '/imports/common/decorators/entity.decorator';
import { BaseEntity } from '/imports/common/entities/base.entity';

export interface UserStatusType {
	online: boolean;
	idle?: boolean;
	lastLogin?: any;
}

// TODO: Add UserStatus mongoose schema

export interface UserProfileType {
	profile: string;
	name: string;
	path?: string;
}

@Entity('users', Meteor.users)
export class User extends BaseEntity implements Meteor.User {
	static collection: Mongo.Collection<User>;

	_id: string;
	@Index({ 'profile.name': 'text' })
	@Index({ 'profile.profile': 1 }, { name: 'profile.profile' })
	profile: UserProfileType;
	@Index({ 'status.online': 1 }, { name: 'status.online' })
	status: UserStatusType;

	username?: string;
	emails?: Meteor.UserEmail[];
	services?: any;

	createdAt?: Date;
}
