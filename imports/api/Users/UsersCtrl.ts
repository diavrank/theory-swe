import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import AuthGuard from './../../middlewares/AuthGuard';
import { ResponseMessage } from '../../startup/server/utils/ResponseMessage';
import { check, Match } from 'meteor/check';
import UsersServ from './UsersServ';
import Binnacle from '../../middlewares/Binnacle';
import './UserPresenceConfig';
import { User, UserType } from '/imports/api/Users/User';
import Permissions from '../../startup/server/Permissions';

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

Accounts.validateLoginAttempt((loginAttempt: any) => {
	if (loginAttempt.allowed) {
		if (!loginAttempt.user.emails[0].verified) {
			throw new Meteor.Error('403', 'El correo de la cuenta no se ha verificado aún.');
		}
		if (loginAttempt.user.services.resume) {
			if (loginAttempt.user.services.resume.loginTokens) {
				const loginTokensOfUser = loginAttempt.user.services.resume.loginTokens;
				if (loginTokensOfUser.length > 1) {
					Meteor.users.update(loginAttempt.user._id, {
						$set: {
							'services.resume.loginTokens': [loginTokensOfUser.pop()]
						}
					});
				}
			}
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
export const saveUserMethod = new ValidatedMethod({
	name: 'user.save',
	mixins: [MethodHooks],
	permissions: [Permissions.USERS.CREATE.VALUE, Permissions.USERS.UPDATE.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	validate({ user }: { user: Meteor.User }) {
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
			throw new Meteor.Error('403', 'La información introducida no es válida');
		}
		UsersServ.validateEmail(user.emails[0].address, user._id);
		UsersServ.validateUsername(user.username, user._id);
	},
	async run({ user, photoFileUser }: { user: MeteorAstronomy.Model<UserType>, photoFileUser: any }) {
		const responseMessage = new ResponseMessage();
		if (user._id) {//if exists then update it
			try {
				const userToBeUpdated = User.findOne(user._id);
				userToBeUpdated.set({ username: user.username, profile: user.profile, emails: user.emails });
				await UsersServ.updateUser(userToBeUpdated, photoFileUser);
				responseMessage.create('Usuario actualizado');
			} catch (err) {
				console.error('Error updating user: ', err);
				throw new Meteor.Error('500', 'Error al actualizar el usuario.');
			}
		} else {//otherwise is created
			try {
				await UsersServ.createUser(user, photoFileUser);
				responseMessage.create('Se ha guardado este usuario.');
			} catch (err) {
				console.error('Error creating user: ', err);
				throw new Meteor.Error('500', 'Error al crear el usuario');
			}
		}
		return responseMessage;
	}
});

/**
 * @summary Delete a user
 * @method user.delete
 * @param idUser  - { idUser: string }
 */
export const deleteUserMethod = new ValidatedMethod({
	name: 'user.delete',
	mixins: [MethodHooks],
	permissions: [Permissions.USERS.DELETE.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	validate({ idUser }: { idUser: string }) {
		try {
			check(idUser, String);
		} catch (exception) {
			console.error('user.delete: ', exception);
			throw new Meteor.Error('403', 'La información introducida no es válida');
		}
	},
	run({ idUser }: { idUser: string }) {
		const responseMessage = new ResponseMessage();
		try {
			const user = User.findOne(idUser);
			if (user._id) {
				UsersServ.deleteUser(user);
			}
			responseMessage.create('Se eliminó el usuario correctamente');
		} catch (err) {
			console.error('user.delete: ', err);
			throw new Meteor.Error('500', 'Error al eliminar el usuario');
		}
		return responseMessage;
	}
});

/**
 * @summary Update personal data of a user
 * @method user.updatePersonalData
 * @param user
 * {user:Meteor.User}
 */
export const updatePersonalDataMethod = new ValidatedMethod({
	name: 'user.updatePersonalData',
	mixins: [MethodHooks],
	beforeHooks: [Binnacle.checkIn, AuthGuard.isUserLogged],
	afterHooks: [Binnacle.checkOut],
	validate({ user }: { user: Meteor.User }) {
		try {
			check(user, {
				_id: Match.OneOf(String, null),
				username: String,
				emails: [{ address: String, verified: Boolean }],
				profile: {
					profile: String,
					name: String,
					path: Match.OneOf(String, null)
				}
			});
		} catch (exception) {
			throw new Meteor.Error('403', 'La información introducida no es válida');
		}
		UsersServ.validateEmail(user.emails[0].address, user._id);
		UsersServ.validateUsername(user.username, user._id);
	},
	async run({ user, photoFileUser }: { user: MeteorAstronomy.Model<UserType>, photoFileUser: any }) {
		const responseMessage = new ResponseMessage();
		try {
			const userToBeUpdated = User.findOne(user._id);
			userToBeUpdated.set({ username: user.username, profile: user.profile, emails: user.emails });
			await UsersServ.updateUser(userToBeUpdated, photoFileUser);
			responseMessage.create('Se actualizó la información exitosamente');

		} catch (exception) {
			console.error('Error updating user: ', exception);
			throw new Meteor.Error('500', 'Error al actualizar');
		}
		return responseMessage;
	}
});

