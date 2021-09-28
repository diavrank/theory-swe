import { Mongo } from 'meteor/mongo';

export interface ProfileType {
	_id?: string;
	name: string;
	description: string;
	permissions: string[];
}

export const Profile = new Mongo.Collection<ProfileType>('profiles');
