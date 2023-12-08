import { Meteor } from 'meteor/meteor';
import { ResponseMessage } from '../../startup/server/utils/ResponseMessage';
import fileHelper from '../../startup/server/utils/FileOperations';
import ProfilesServ from '../Profiles/ProfilesServ';
import { User, UserType } from '/imports/api/Users/User';
import { Profile } from '/imports/api/Profiles/Profile';

export const PATH_USER_FILES = 'users/';

export default {
	validateEmail(newEmail: string, userId: string) {
		const existsEmail = Accounts.findUserByEmail(newEmail);
		if (userId) {
			const oldUser = Meteor.users.findOne(userId);
			if (oldUser?.emails) {
				if (oldUser.emails[0].address !== newEmail && existsEmail) {
					throw new Meteor.Error('403', 'The new email is already in use');
				}
			}
		} else if (existsEmail) {
			throw new Meteor.Error('403', 'The new email is already in use');
		}
	},
	validateUsername(newUsername: string, userId: string) {
		const existsUsername = Accounts.findUserByUsername(newUsername);
		if (userId) {
			const oldUser = Meteor.users.findOne(userId);
			if (oldUser?.username !== newUsername && existsUsername) {
				throw new Meteor.Error('403', 'The new username is already in use');
			}
		} else if (existsUsername) {
			throw new Meteor.Error('403', 'The new username is already in use');
		}
	},
	validateProfile(profileName: string) {
		if (!Profile.findOne({ name: profileName })) {
			throw new Meteor.Error('403', 'Invalid profile name');
		}
	},
	async createUser(user: MeteorAstronomy.Model<UserType>, photoFileUser: any) {
		const userId = Accounts.createUser({
			username: user.username,
			// @ts-ignore
			email: user.emails[0].address,
			profile: user.profile
		});
		user = User.findOne(userId);
		let avatarSrc = null;
		if (userId && user.emails) {
			ProfilesServ.setUserRoles(userId, user.profile.profile);
			Accounts.sendEnrollmentEmail(userId, user.emails[0].address);
		}
		if (photoFileUser) {
			const response = await fileHelper.saveFileFromBase64(photoFileUser, 'avatar', PATH_USER_FILES + userId);
			if (!response.data.success) {
				throw new Meteor.Error('500', 'Error saving user photo.');
			} else {
				avatarSrc = response.data.fileUrl;
			}
		}
		if (avatarSrc) {
			user.profile.path = avatarSrc;
			user.save({ fields: ['profile'] });
		}
	},
	async updateUser(newUser: MeteorAstronomy.Model<UserType>, photoFileUser: any): Promise<ResponseMessage> {
		const responseMessage = new ResponseMessage();
		const currentUser = User.findOne(newUser._id);
		if (currentUser?.emails && newUser.emails) {
			if (currentUser.emails[0].address !== newUser.emails[0].address) {
				Accounts.removeEmail(newUser._id, currentUser.emails[0].address);
				Accounts.addEmail(newUser._id, newUser.emails[0].address);
				Accounts.sendVerificationEmail(newUser._id, newUser.emails[0].address);
			}
		}
		if (currentUser?.username !== newUser.username && newUser.username) {
			Accounts.setUsername(newUser._id, newUser.username);
		}
		newUser.save({ fields: ['profile'] });
		if (photoFileUser) {
			if (currentUser?.profile.path) {
				fileHelper.remove(currentUser.profile.path.substring(currentUser.profile.path.indexOf(PATH_USER_FILES)));
			}
			const response = await fileHelper.saveFileFromBase64(photoFileUser, 'avatar', PATH_USER_FILES + newUser._id);
			if (!response.data.success) {
				throw new Meteor.Error('500', 'Error saving user photo.');
			} else {
				newUser.profile.path = response.data.fileUrl;
				newUser.save({ fields: ['profile'] });
			}
		}
		responseMessage.message = 'User updated successful';
		return responseMessage;
	}
};
