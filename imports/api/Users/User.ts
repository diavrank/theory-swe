import { Meteor } from 'meteor/meteor';
import { AstronomyEvent, Class } from 'meteor/jagi:astronomy';
import { Profile, ProfileType } from '/imports/api/Profiles/Profile';
import ProfilesServ from '/imports/api/Profiles/ProfilesServ';
import fileHelper from '/imports/startup/server/utils/FileOperations';
import { PATH_USER_FILES } from '/imports/api/Users/UsersServ';

interface UserStatusType {
	online: boolean;
	idle?: boolean;
	lastLogin?: any;
}

const UserStatus = Class.create<UserStatusType>({
	name: 'UserStatus',
	fields: {
		online: { type: Boolean, index: 1 },
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
	path?: string;
}

const UserProfile = Class.create<UserProfileType>({
	name: 'UserProfile',
	fields: {
		profile: { type: String, index: 1 },
		name: String,
		path: { type: String, optional: true }
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
	},
	events: {
		afterSave(event: AstronomyEvent<UserType>) {
			if (event.doc.profile.profile !== event.oldDoc?.profile.profile) {
				ProfilesServ.setUserRoles(event.currentTarget._id, event.currentTarget.profile.profile);
			}
		},
		beforeRemove(event: AstronomyEvent<UserType>) {
			fileHelper.remove(PATH_USER_FILES + event.currentTarget._id);
		},
		afterRemove(event: AstronomyEvent<UserType>) {
			// @ts-ignore
			Meteor.roleAssignment.remove({ 'user._id': event.currentTarget._id });
		}
	}
});
