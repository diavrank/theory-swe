import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';
import { Profile, ProfileType } from '/imports/api/Profiles/Profile';

interface UserStatusType {
	online: boolean;
	idle?: boolean;
	lastLogin?: any;
}

const UserStatus = Class.create<UserStatusType>({
	name: 'UserStatus',
	fields: {
		online: Boolean,
		idle: {
			type: Boolean,
			optional: true
		},
		lastLogin: {
			type: Object,
			optional: true
		}
	}
});

interface UserProfileType {
	profile: string;
	name: string;
	path: string;
}

const UserProfile = Class.create<UserProfileType>({
	name: 'UserProfile',
	fields: {
		profile: String,
		name: String,
		path: String
	}
});

export interface UserType extends Meteor.User {
	profile: UserProfileType;
	status: UserStatusType;

	getProfile(): ProfileType;
}

export const User = Class.create<UserType>({
	name: 'User',
	collection: Meteor.users as unknown as Mongo.Collection<UserType>,
	fields: {
		createdAt: Date,
		emails: {
			type: [Object],
			default: function() {
				return [];
			}
		},
		username: String,
		profile: {
			type: UserProfile,
			default: function() {
				return {};
			}
		},
		status: {
			type: UserStatus,
			default: function() {
				return { online: false };
			}
		}
	},
	helpers: {
		getProfile() {
			return Profile.findOne({ name: this.profile.profile });
		}
	}
});
