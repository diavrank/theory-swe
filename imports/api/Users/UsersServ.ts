import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ResponseMessage } from '../../startup/server/utils/ResponseMessage';
import fileHelper from '../../startup/server/utils/FileOperations';
import ProfilesServ from '../Profiles/ProfilesServ';
import { User, UserType } from '/imports/api/Users/User';

const PATH_USER_FILES = 'users/';

export default {
	validateEmail(newEmail: string, userId: string) {
		const existsEmail = Accounts.findUserByEmail(newEmail);
		if (userId) {
			const oldUser = Meteor.users.findOne(userId);
			if (oldUser?.emails) {
				if (oldUser.emails[0].address !== newEmail && existsEmail) {
					throw new Meteor.Error('403', 'El nuevo email ya se encuentra en uso');
				}
			}
		} else if (existsEmail) {
			throw new Meteor.Error('403', 'El nuevo email ya se encuentra en uso');
		}
	},
	validateUsername(newUsername: string, userId: string) {
		const existsUsername = Accounts.findUserByUsername(newUsername);
		if (userId) {
			const oldUser = Meteor.users.findOne(userId);
			if (oldUser?.username !== newUsername && existsUsername) {
				throw new Meteor.Error('403', 'El nuevo nombre de usuario ya se encuentra en uso');
			}
		} else if (existsUsername) {
			throw new Meteor.Error('403', 'El nuevo nombre de usuario ya se encuentra en uso');
		}
	},
	async createUser(user: MeteorAstronomy.Model<UserType>, photoFileUser: any): Promise<ResponseMessage> {
		const responseMessage = new ResponseMessage();
		const idUser = Accounts.createUser({
			username: user.username,
			// @ts-ignore
			email: user.emails[0].address,
			profile: user.profile
		});
		user = User.findOne(idUser);

		let avatarSrc = null;
		if (idUser && user.emails) {
			responseMessage.data = { idUser };
			ProfilesServ.setUserRoles(idUser, user.profile.profile);
			Accounts.sendEnrollmentEmail(idUser, user.emails[0].address);
		}
		if (photoFileUser) {
			const response = await fileHelper.saveFileFromBase64(photoFileUser, 'avatar', PATH_USER_FILES + idUser);
			if (!response.data.success) {
				throw new Meteor.Error('500', 'Error al subir la foto.');
			} else {
				avatarSrc = response.data.fileUrl;
			}
		}
		if (avatarSrc) {
			user.profile.path = avatarSrc;
			user.save();
		}
		responseMessage.message = 'User created successful';
		return responseMessage;
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
		ProfilesServ.setUserRoles(newUser._id, newUser.profile.profile);
		if (photoFileUser) {
			if (currentUser?.profile.path) {
				fileHelper.remove(currentUser.profile.path.substring(currentUser.profile.path.indexOf(PATH_USER_FILES)));
			}
			const response = await fileHelper.saveFileFromBase64(photoFileUser, 'avatar', PATH_USER_FILES + newUser._id);
			if (!response.data.success) {
				throw new Meteor.Error('500', 'Error al subir la foto.');
			} else {
				newUser.profile.path = response.data.fileUrl;
				newUser.save();
			}
		}
		responseMessage.message = 'User updated successful';
		return responseMessage;
	},
	deleteUser(user: MeteorAstronomy.Model<UserType>): ResponseMessage {
		const responseMessage = new ResponseMessage();
		fileHelper.remove(PATH_USER_FILES + user._id);
		// @ts-ignore
		Meteor.roleAssignment.remove({ 'user._id': user._id });
		user.remove();
		responseMessage.create('User removed!');
		return responseMessage;
	}
};
