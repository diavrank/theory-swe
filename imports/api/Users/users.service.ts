import { ProfileCollection } from "@api/Profiles/ProfileCollection";
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import fileHelper from '../../startup/server/utils/FileOperations';
import { ResponseMessage } from '../../startup/server/utils/ResponseMessage';
import ProfilesServ from '../Profiles/ProfilesServ';
import { SaveUserRequestDto } from './dtos/save-user-request.dto';
import { UserRequestDto } from './dtos/user-request.dto';
import { UserUpdatePersonalDataRequestDto } from './dtos/user-update-personal-data-request.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

export const PATH_USER_FILES = 'users/';

export class UserService {
	private userRepository = new UserRepository();

	async validateEmail(newEmail: string, userId: string) {
		const existsEmail = await Accounts.findUserByEmail(newEmail);
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
	}

	async validateUsername(newUsername: string, userId: string) {
		const existsUsername = await Accounts.findUserByUsername(newUsername);
		if (userId) {
			const oldUser = await Meteor.users.findOneAsync(userId);
			if (oldUser?.username !== newUsername && existsUsername) {
				throw new Meteor.Error('403', 'The new username is already in use');
			}
		} else if (existsUsername) {
			throw new Meteor.Error('403', 'The new username is already in use');
		}
	}

	async validateProfile(profileName: string) {
		if (!await ProfileCollection.findOneAsync({ name: profileName })) {
			throw new Meteor.Error('403', 'Invalid profile name');
		}
	}

	async saveUser(usersRequestDto: SaveUserRequestDto) {
		const responseMessage = new ResponseMessage();
		const { user, photoFileUser } = usersRequestDto;

		if (user._id) {//if exists then update it
			const userToBeUpdated = await this.userRepository.findOneOrFail(user._id);
			userToBeUpdated.username = user.username;
			userToBeUpdated.profile = user.profile;
			userToBeUpdated.emails = user.emails;

			await this.updateUser(userToBeUpdated, photoFileUser);
			responseMessage.create('User updated!');
		} else {//otherwise is created
			await this.createUser(user, photoFileUser);
			responseMessage.create('User created!');
		}
		return responseMessage;
	}

	async createUser(userRequestDto: UserRequestDto, photoFileUser?: string) {
		const userId = await Accounts.createUserAsync({
			username: userRequestDto.username,
			email: userRequestDto.emails[0].address,
			profile: userRequestDto.profile
		});
		const user = await this.userRepository.findOneOrFail(userId);
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
			user.profile.path = avatarSrc;
			await Meteor.users.upsertAsync(user._id, {
				$set: {
					'profile.path': user.profile.path,
				}
			})
		}
	}

	async updateUser(newUser: User, photoFileUser: any): Promise<ResponseMessage> {
		const responseMessage = new ResponseMessage();
		const currentUser = await Meteor.users.findOneAsync(newUser._id) as User;
		if (currentUser?.emails && newUser.emails) {
			if (currentUser.emails[0].address !== newUser.emails[0].address) {
				Accounts.removeEmail(newUser._id, currentUser.emails[0].address);
				await Accounts.addEmailAsync(newUser._id, newUser.emails[0].address);
				Accounts.sendVerificationEmail(newUser._id, newUser.emails[0].address);
			}
		}
		if (currentUser?.username !== newUser.username && newUser.username) {
			Accounts.setUsername(newUser._id, newUser.username);
		}

		await Meteor.users.upsertAsync(newUser._id, {
			$set: {
				'profile': newUser.profile,
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
				await Meteor.users.upsertAsync(newUser._id, {
					$set: {
						'profile.path': newUser.profile.path,
					}
				});
			}
		}
		responseMessage.message = 'User updated successful';
		return responseMessage;
	}

	async updatePersonalData(requestDto: UserUpdatePersonalDataRequestDto): Promise<ResponseMessage> {
		const userToBeUpdated = await this.userRepository.findOneOrFail(requestDto.user._id);
		userToBeUpdated.username = requestDto.user.username;
		userToBeUpdated.profile.name = requestDto.user.profile.name;
		userToBeUpdated.emails = requestDto.user.emails;
		return this.updateUser(userToBeUpdated, requestDto.photoFileUser);
	}


	async deleteUser(userId: string) {
		const user = await this.userRepository.findOneOrFail(userId);
		await this.userRepository.softDelete(user._id);

	}

	async afterSave(event: any) {
		if (event.doc.profile.profile !== event.oldDoc?.profile.profile) {
			await ProfilesServ.setUserRoles(event.currentTarget._id, event.currentTarget.profile.profile);
		}
	}

	beforeRemove(event: any) {
		fileHelper.remove(PATH_USER_FILES + event.currentTarget._id);
	}

	async afterRemove(event: any) {
		// @ts-ignore
		await Meteor.roleAssignment.removeAsync({ 'user._id': event.currentTarget._id });
	}
}
