import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { RoleType } from './Permission';
import { BaseRepository } from '/imports/common/repositories/base.repository';

export class RoleRepository extends BaseRepository<RoleType> {

	constructor() {
		super(Meteor.roles as Mongo.Collection<RoleType>);
	}

	async findByIds(ids: string[]): Promise<RoleType[]> {
		return this.find({ _id: { $in: ids } });
	}

	async findComplement(ids: string[]): Promise<RoleType[]> {
		return this.find({ _id: { $nin: ids } });
	}
}
