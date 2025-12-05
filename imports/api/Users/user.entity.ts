import { Meteor } from 'meteor/meteor';

interface UserStatusType {
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

export interface User extends Meteor.User {
    profile: UserProfileType;
	status: UserStatusType;
}
