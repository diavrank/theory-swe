import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ResponseMessage } from '../../startup/server/utils/ResponseMessage';
import fileHelper from '../../startup/server/utils/FileOperations';
import Utilities from '../../startup/server/utils/helpers';
import ProfilesServ from '../Profiles/ProfilesServ';

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
	async createUser(user: Meteor.User, photoFileUser: any): Promise<ResponseMessage> {
		const responseMessage = new ResponseMessage();
		const idUser = Accounts.createUser({
			username: user.username,
			// @ts-ignore
			email: user.emails[0].address,
			profile: user.profile
		});
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
			Meteor.users.update(idUser, {
				$set: {
					'profile.path': avatarSrc
				}
			});
		}
		responseMessage.message = 'User created successful';
		return responseMessage;
	},
	async updateUser(newUser: Meteor.User, photoFileUser: any): Promise<ResponseMessage> {
		const responseMessage = new ResponseMessage();
		const currentUser: Meteor.User | undefined = Meteor.users.findOne(newUser._id);
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
		Meteor.users.update(newUser._id, {
			$set: {
				profile: {
					profile: newUser.profile.profile,
					name: newUser.profile.name,
					path: currentUser?.profile.path,
					updated_at: Utilities.currentLocalDate()
				}
			}
		});
		ProfilesServ.setUserRoles(newUser._id, newUser.profile.profile);
		if (photoFileUser) {
			if (currentUser?.profile.path) {
				fileHelper.remove(currentUser.profile.path
					.substring(currentUser.profile.path.indexOf(PATH_USER_FILES)));
			}
			const response = await fileHelper.saveFileFromBase64(photoFileUser, 'avatar', PATH_USER_FILES + newUser._id);
			if (!response.data.success) {
				throw new Meteor.Error('500', 'Error al subir la foto.');
			} else {
				Meteor.users.update(newUser._id, {
					$set: {
						'profile.path': response.data.fileUrl
					}
				});
			}
		}
		responseMessage.message = 'User updated successful';
		return responseMessage;
	},
	async deleteUser(user: Meteor.User): Promise<ResponseMessage> {
		const responseMessage = new ResponseMessage();
		Meteor.users.remove(user._id);
		fileHelper.remove(PATH_USER_FILES + user._id);
		// @ts-ignore
		Meteor.roleAssignment.remove({ 'user._id': user._id });
		responseMessage.create('User removed!');
		return responseMessage;
	}
};
