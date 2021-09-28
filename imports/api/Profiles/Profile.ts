import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

export interface ProfileType {
	_id?: string;
	name: string;
	description: string;
	permissions: string[];
}

export const ProfileCollection = new Mongo.Collection<ProfileType>('profiles');

export const Profile = Class.create<ProfileType>({
	name: 'Profile',
	collection: ProfileCollection,
	fields: {
		name: String,
		description: String,
		permissions: [String]
	}
});
