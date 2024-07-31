import { Mongo } from 'meteor/mongo';

export interface ProfileType {
	_id: string;
	name: string;
	description: string;
	permissions: string[];

	getPermissions(): Function;
	getPermissionsComplement(): Function;
}

export const ProfileCollection = new Mongo.Collection<ProfileType>('profiles');
