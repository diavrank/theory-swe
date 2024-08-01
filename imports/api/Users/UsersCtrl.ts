import { Meteor } from 'meteor/meteor';
import AuthGuard from './../../middlewares/AuthGuard';
import { ResponseMessage } from '@server/utils/ResponseMessage';
import { check, Match } from 'meteor/check';
import UsersServ from './UsersServ';
import Binnacle from '../../middlewares/Binnacle';
import Permissions from '../../startup/server/Permissions';
import {UserType} from "@api/Users/User";
import {createMethod} from "meteor/jam:method";

Accounts.onCreateUser((options: any, user: Meteor.User) => {
	//Configuration for user-status
	const customizedUser = Object.assign({
		status: {
			online: false
		}
	}, user);
	// We still want the default hook's 'profile' behavior.
	if (options.profile) {
		customizedUser.profile = options.profile;
	}
	return customizedUser;
});

Accounts.validateLoginAttempt(async(loginAttempt: any) => {
	if (loginAttempt.allowed) {
		if (!loginAttempt.user.emails[0].verified) {
			throw new Meteor.Error('403', 'The account email has not been verified yet.');
		}
		const loginTokensOfUser:string[] = loginAttempt.user.services.resume?.loginTokens || [];
		if (loginTokensOfUser.length > 1) {
			await Meteor.users.updateAsync(loginAttempt.user._id, {
				$set: {
					'services.resume.loginTokens': [loginTokensOfUser.pop()]
				}
			});
		}
		return true;
	}
});

/**
 * @summary Save a user
 * @method save.user
 * @param user User to save.
 * @typeParam Meteor.user
 * interface User {
        _id: string;
        username?: string;
        emails?: UserEmail[];
        createdAt?: Date;
        profile?: any;
        services?: any;
    }
 *
 * @param photoFileUser  Photo of user (in binary format)
 */
export const saveUserMethod = createMethod({
	name: 'user.save',
	before: [Binnacle.checkIn,
		AuthGuard.checkPermission([Permissions.USERS.CREATE.VALUE, Permissions.USERS.UPDATE.VALUE])],
	after: [Binnacle.checkOut],
	async validate({ user }: { user: Meteor.User }) {
		try {
			check(user, {
				_id: Match.Maybe(String),
				username: String,
				emails: [{ address: String, verified: Boolean }],
				profile: {
					profile: String,
					name: String,
					path: Match.Maybe(String)
				}
			});
		} catch (exception) {
			console.error('user.save: ', exception);
			throw new Meteor.Error('403', 'The information entered is not valid');
		}
		await UsersServ.validateEmail(user.emails[0].address, user._id);
		await UsersServ.validateUsername(user.username, user._id);
		await UsersServ.validateProfile(user.profile.profile);
	},
	async run({ user, photoFileUser }: { user: UserType, photoFileUser: any }) {
		const responseMessage = new ResponseMessage();
		if (user._id) {//if exists then update it
			try {
				const userToBeUpdated = await Meteor.users.findOneAsync(user._id) as UserType;
				userToBeUpdated.username=user.username;
				userToBeUpdated.profile=user.profile;
				userToBeUpdated.emails=user.emails;

				await UsersServ.updateUser(userToBeUpdated, photoFileUser);
				responseMessage.create('User updated!');
			} catch (exception) {
				console.error('user.save: ', exception);
				throw new Meteor.Error('500', 'An error occurred while updating the user');
			}
		} else {//otherwise is created
			try {
				await UsersServ.createUser(user as UserType, photoFileUser);
				responseMessage.create('User created!');
			} catch (exception) {
				console.error('user.save: ', exception);
				throw new Meteor.Error('500', 'An error occurred while creating the user');
			}
		}
		return responseMessage;
	}
});

/**
 * @summary Delete a user
 * @method user.delete
 * @param userId  - { userId: string }
 */
export const deleteUserMethod = createMethod({
	name: 'user.delete',
	before: [Binnacle.checkIn, AuthGuard.checkPermission([Permissions.USERS.DELETE.VALUE])],
	after: [Binnacle.checkOut],
	async validate({ userId }: { userId: string }) {
		try {
			check(userId, String);
		} catch (exception) {
			console.error('user.delete: ', exception);
			throw new Meteor.Error('403', 'The information entered is not valid');
		}
		if (!await Meteor.users.findOneAsync(userId)) {
			throw new Meteor.Error('403', 'User does not exists');
		}
	},
	async run({ userId }: { userId: string }) {
		const responseMessage = new ResponseMessage();
		try {
			await Meteor.users.removeAsync(userId);
			responseMessage.create('User removed successfully!');
		} catch (exception) {
			console.error('user.delete: ', exception);
			throw new Meteor.Error('500', 'An error occurred while removing the user');
		}
		return responseMessage;
	}
});

/**
 * @summary Update personal data of the user logged in
 * @method user.updatePersonalData
 * @param user
 * {user:Meteor.User}
 */
export const updatePersonalDataMethod = createMethod({
	name: 'user.updatePersonalData',
	before: [Binnacle.checkIn, AuthGuard.isUserLogged],
	after: [Binnacle.checkOut],
	async validate({ user }: { user: UserType }) {
		try {
			check(user, {
				username: String,
				emails: [{ address: String, verified: Boolean }],
				profile: {
					profile: String,
					name: String,
					path: Match.Maybe(String)
				}
			});
		} catch (exception) {
			console.error('user.updatePersonalData: ', exception);
			throw new Meteor.Error('403', 'The information entered is not valid');
		}
		await UsersServ.validateEmail(user.emails[0].address, this.userId);
		await UsersServ.validateUsername(user.username, this.userId);
	},
	async run({ user, photoFileUser }: { user: UserType, photoFileUser: any }) {
		const responseMessage = new ResponseMessage();
		try {
			const userToBeUpdated = await Meteor.users.findOneAsync(user._id) as UserType;
			userToBeUpdated.username=user.username;
			userToBeUpdated.profile.name=user.profile.name;
			userToBeUpdated.emails=user.emails;
			await UsersServ.updateUser(userToBeUpdated, photoFileUser);
			responseMessage.create('Information updated!');
		} catch (exception) {
			console.error('user.updatePersonalData: ', exception);
			throw new Meteor.Error('500', 'An error occurred while updating the information');
		}
		return responseMessage;
	}
});

