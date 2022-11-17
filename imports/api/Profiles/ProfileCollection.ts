import { Mongo } from 'meteor/mongo';
import { RoleType } from '/imports/api/Permissions/Permission';

export interface ProfileType {
	_id: string;
	name: string;
	description: string;
	permissions: string[];

	getPermissions(): Mongo.Cursor<MeteorAstronomy.Model<RoleType>>;
	getPermissionsComplement(): Mongo.Cursor<MeteorAstronomy.Model<RoleType>>;
}

export const ProfileCollection = new Mongo.Collection<ProfileType>('profiles');
