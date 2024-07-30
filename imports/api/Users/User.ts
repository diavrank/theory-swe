import { Meteor } from 'meteor/meteor';
import {ProfileType} from "@api/Profiles/ProfileCollection";

interface UserStatusType {
	online: boolean;
	idle?: boolean;
	lastLogin?: any;
}

// TODO: Add UserStatus mongoose schema

interface UserProfileType {
	profile: string;
	name: string;
	path?: string;
}

// TODO: Add UserProfile mongoose schema

export interface UserType extends Meteor.User {
	profile: UserProfileType;
	status: UserStatusType;

	getProfile(): ProfileType;
}



// TODO: Add User mongoose schema
