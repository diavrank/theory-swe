import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import fileHelper from '../../startup/server/utils/FileOperations';
import { ProfilesService } from "../Profiles/profiles.service";
import { SaveUserRequestDto } from './dtos/save-user-request.dto';
import { UserRequestDto } from './dtos/user-request.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { Inject } from '/imports/common/decorators/inject.decorator';
import { Injectable } from '/imports/common/decorators/injectable.decorator';
import { forwardRef } from '/imports/common/utils/forward-ref';

export const PATH_USER_FILES = 'users/';

@Injectable()
export class UserService {
	private userRepository = new UserRepository();

	constructor(
		@Inject(forwardRef(() => ProfilesService))
		private profilesService: ProfilesService
	) { }

	async validateEmail(newEmail: string, userId: string) {
		const existsEmail = await Accounts.findUserByEmail(newEmail);
		if (userId) {
			const oldUser = await this.userRepository.findOneOrFail(userId);
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
			const oldUser = await this.userRepository.findOneOrFail(userId);
			if (oldUser?.username !== newUsername && existsUsername) {
				throw new Meteor.Error('403', 'The new username is already in use');
			}
		} else if (existsUsername) {
			throw new Meteor.Error('403', 'The new username is already in use');
		}
	}

	async validateProfile(profileName: string) {
		if (!await this.profilesService.profileExists(profileName)) {
			throw new Meteor.Error('403', 'Invalid profile name');
		}
	}

	async saveUser(usersRequestDto: SaveUserRequestDto) {
		const { user, photoFileUser } = usersRequestDto;
		let userId = user.id;

		if (userId) {//if exists then update it
			const userToBeUpdated = await this.userRepository.findOneOrFail(user.id);
			userToBeUpdated.username = user.username;
			userToBeUpdated.profile = user.profile;
			if (userToBeUpdated.emails[0]?.address !== user.email) {
				userToBeUpdated.emails[0].address = user.email;
				userToBeUpdated.emails[0].verified = false;
			}

			await this.updateUser(userToBeUpdated, photoFileUser);
		} else {//otherwise is created
			const newUser = await this.createUser(user, photoFileUser);
			userId = newUser._id;
		}

		return this.userRepository.findOneOrFail(userId)
	}

	async createUser(userRequestDto: UserRequestDto, photoFileUser?: string): Promise<User> {
		const userId = await Accounts.createUserAsync({
			username: userRequestDto.username,
			email: userRequestDto.email,
			profile: userRequestDto.profile
		});
		const user = await this.userRepository.findOneOrFail(userId);
		let avatarSrc = null;
		if (userId && user?.emails) {
			await this.profilesService.setUserRoles(userId, user.profile?.profile);
			Accounts.sendEnrollmentEmail(userId, user.emails[0].address);
		}
		if (photoFileUser) {
			const response = await fileHelper.saveFileFromBase64(photoFileUser, 'avatar', PATH_USER_FILES + userId + 'avatar');
			if (!response.data.success) {
				throw new Meteor.Error('500', 'Error saving user photo.');
			} else {
				avatarSrc = response.data.fileUrl;
			}
		}
		if (avatarSrc) {
			user.profile.path = avatarSrc;
			await this.userRepository.upsert(user._id, {
				$set: {
					'profile.path': user.profile.path,
				}
			})
		}

		return user;
	}

	async updateUser(newUser: User, photoFileUser: any): Promise<void> {
		const currentUser = await this.userRepository.findOneOrFail(newUser._id);
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

		await this.userRepository.upsert(newUser._id, {
			$set: {
				'profile': newUser.profile,
			}
		});

		if (currentUser.profile.profile !== newUser.profile.profile) {
			await this.profilesService.setUserRoles(currentUser._id, newUser.profile.profile);
		}

		if (photoFileUser) {
			if (currentUser?.profile.path) {
				fileHelper.remove(currentUser.profile.path.substring(currentUser.profile.path.indexOf(PATH_USER_FILES)));
			}
			const response = await fileHelper.saveFileFromBase64(photoFileUser, 'avatar', PATH_USER_FILES + newUser._id + 'avatar');
			if (!response.data.success) {
				throw new Meteor.Error('500', 'Error saving user photo.');
			} else {
				newUser.profile.path = response.data.fileUrl;
				await this.userRepository.upsert(newUser._id, {
					$set: {
						'profile.path': newUser.profile.path,
					}
				});
			}
		}
	}

	async deleteUser(userId: string) {
		const user = await this.userRepository.findOneOrFail(userId);
		fileHelper.remove(PATH_USER_FILES + userId);
		// @ts-ignore
		await Meteor.roleAssignment.removeAsync({ 'user._id': userId });
		await this.userRepository.delete(user._id);
	}

	getUsersByProfileName(profileName: string): Promise<User[]> {
		return this.userRepository.find({ 'profile.profile': profileName });
	}

	getUserById(id: string): Promise<User> {
		return this.userRepository.findOneOrFail(id);
	}
}
