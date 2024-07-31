import { Meteor } from 'meteor/meteor';
import { ResponseMessage } from '../../startup/server/utils/ResponseMessage';
import fileHelper from '../../startup/server/utils/FileOperations';
import ProfilesServ from '../Profiles/ProfilesServ';
import { UserType } from '/imports/api/Users/User';
import {ProfileCollection} from "@api/Profiles/ProfileCollection";

export const PATH_USER_FILES = 'users/';

export default {
	async validateEmail(newEmail: string, userId: string) {
		const existsEmail = Accounts.findUserByEmail(newEmail);
		if (userId) {
			const oldUser = await Meteor.users.findOneAsync(userId);
			if (oldUser?.emails) {
				if (oldUser.emails[0].address !== newEmail && existsEmail) {
					throw new Meteor.Error('403', 'The new email is already in use');
				}
			}
		} else if (existsEmail) {
			throw new Meteor.Error('403', 'The new email is already in use');
		}
	},
	async validateUsername(newUsername: string, userId: string) {
		const existsUsername = Accounts.findUserByUsername(newUsername);
		if (userId) {
			const oldUser = await Meteor.users.findOneAsync(userId);
			if (oldUser?.username !== newUsername && existsUsername) {
				throw new Meteor.Error('403', 'The new username is already in use');
			}
		} else if (existsUsername) {
			throw new Meteor.Error('403', 'The new username is already in use');
		}
	},
	async validateProfile(profileName: string) {
		if (!await ProfileCollection.findOneAsync({ name: profileName })) {
			throw new Meteor.Error('403', 'Invalid profile name');
		}
	},
	async createUser(user: UserType, photoFileUser: any) {
		const userId = Accounts.createUser({
			username: user.username,
			// @ts-ignore
			email: user.emails[0].address,
			profile: user.profile
		});
		user = await Meteor.users.findOneAsync(userId) as UserType;
		let avatarSrc = null;
		if (userId && user?.emails) {
			await ProfilesServ.setUserRoles(userId, user.profile?.profile);
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
			await Meteor.users.upsertAsync(user._id,{
				$set:{
					'profile.path':user.profile.path,
				}
			})
		}
	},
	async updateUser(newUser: UserType, photoFileUser: any): Promise<ResponseMessage> {
		const responseMessage = new ResponseMessage();
		const currentUser = await Meteor.users.findOneAsync(newUser._id) as UserType;
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

		await Meteor.users.upsertAsync(newUser._id,{
			$set:{
				'profile':newUser.profile,
			}
		});
		if (photoFileUser) {
			if (currentUser?.profile.path) {
				fileHelper.remove(currentUser.profile.path.substring(currentUser.profile.path.indexOf(PATH_USER_FILES)));
			}
			const response = await fileHelper.saveFileFromBase64(photoFileUser, 'avatar', PATH_USER_FILES + newUser._id);
			if (!response.data.success) {
				throw new Meteor.Error('500', 'Error saving user photo.');
			} else {
				newUser.profile.path = response.data.fileUrl;
				await Meteor.users.upsertAsync(newUser._id,{
					$set:{
						'profile.path':newUser.profile.path,
					}
				});
			}
		}
		responseMessage.message = 'User updated successful';
		return responseMessage;
	},
	/**
	 * TODO: Migrate to mongoose schema
	 * @param event
	 */
	async afterSave(event: any) {
		if (event.doc.profile.profile !== event.oldDoc?.profile.profile) {
			await ProfilesServ.setUserRoles(event.currentTarget._id, event.currentTarget.profile.profile);
		}
	},
	beforeRemove(event: any) {
		fileHelper.remove(PATH_USER_FILES + event.currentTarget._id);
	},
	async afterRemove(event: any) {
		// @ts-ignore
		await Meteor.roleAssignment.removeAsync({ 'user._id': event.currentTarget._id });
	}
};
