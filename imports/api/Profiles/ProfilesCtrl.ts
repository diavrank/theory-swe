import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Profile, ProfileType } from './Profile';
import AuthGuard from './../../middlewares/AuthGuard';
import { ResponseMessage } from '../../startup/server/utils/ResponseMessage';
import { check, Match } from 'meteor/check';
import ProfilesServ from './ProfilesServ';

//Permissions
import Permissions from '../../startup/server/Permissions';
import Binnacle from '../../middlewares/Binnacle';

/**
 * @summary Save a profile
 * @method profile.save
 * @param profile - Object of {@link ProfileType}
 *
 */
export const saveProfileMethod = new ValidatedMethod({
	name: 'profile.save',
	mixins: [MethodHooks],
	permissions: [Permissions.PROFILES.CREATE.VALUE, Permissions.PROFILES.UPDATE.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	validate(profile: ProfileType) {
		try {
			check(profile, {
				_id: Match.OneOf(String, null),
				name: String,
				description: String,
				permissions: [String]
			});
		} catch (exception) {
			console.error('profile.save: ', exception);
			throw new Meteor.Error('403', 'La información introducida no es válida');
		}
		ProfilesServ.validateName(profile.name, profile._id);
	},
	/**
	 * Crea un nuevo perfil de usuario. Si ya existe lo actualiza.
	 * @param profile Información del perfil a crear.
	 */
	run(profile: ProfileType) {
		const responseMessage = new ResponseMessage();
		if (profile._id) {//Si existe entonces lo actualiza
			const users = ProfilesServ.getUsersByProfile(profile._id);
			const oldProfile = Profile.findOne(profile._id);
			try {
				Profile.update(profile._id, {
					$set: {
						name: profile.name,
						description: profile.description,
						permissions: profile.permissions
					}
				});
				if (oldProfile?.name !== profile.name) {
					Meteor.users.update({ 'profile.profile': oldProfile?.name }, {
						$set: {
							'profile.profile': profile.name
						}
					}, { multi: true });
				}
				ProfilesServ.updateProfileUsers(users, profile);
				responseMessage.create('Se actualizó el perfil exitosamente');
			} catch (err) {
				console.error('Error updating profile: ', err);
				throw new Meteor.Error('500', 'Error al actualizar el perfil', err);
			}
		} else { //Sino entonces lo crea
			try {
				Profile.insert({
					name: profile.name,
					description: profile.description,
					permissions: profile.permissions
				});
				responseMessage.create('Se creó el perfil exitosamente');
			} catch (err) {
				console.error('Error updating profile: ', err);
				throw new Meteor.Error('500', 'Error al crear el perfil', err);
			}
		}
		return responseMessage;
	}
});

/**
 * @summary Delete a profile
 * @method profile.delete
 * @param idProfile - {idProfile:string}
 */
export const deleteProfileMethod = new ValidatedMethod({
	name: 'profile.delete',
	mixins: [MethodHooks],
	permissions: [Permissions.PROFILES.DELETE.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	validate({ idProfile }: { idProfile: string }) {
		try {
			check(idProfile, String);
		} catch (exception) {
			console.error('profile.delete: ', exception);
			throw new Meteor.Error('403', 'La información introducida no es válida');
		}
		const users = ProfilesServ.getUsersByProfile(idProfile);
		if (users.length > 0) {
			throw new Meteor.Error('403', 'No se puede eliminar el perfil', 'Hay usuarios usando este perfil');
		}
	},
	/**
	 * Elimina un perfil de la base de datos
	 * @param idProfile Id del perfil a eliminar
	 * @returns {any} Si es exitoso no regresa nada, de lo contrario regresa un mensaje de error.
	 */
	run({ idProfile }: { idProfile: string }) {
		const responseMessage = new ResponseMessage();
		try {
			Profile.remove(idProfile);
			responseMessage.create('Perfil eliminado exitosamente');
		} catch (exception) {
			console.error('profile.delete: ', exception);
			throw new Meteor.Error('500', 'Ocurrió un error al eliminar el perfil');
		}
		return responseMessage;
	}
});
