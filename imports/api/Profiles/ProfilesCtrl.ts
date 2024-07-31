import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import {ProfileCollection, ProfileType} from '/imports/api/Profiles/ProfileCollection';
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
				_id: Match.Maybe(String),
				name: String,
				description: String,
				permissions: [String]
			});
		} catch (exception) {
			console.error('profile.save: ', exception);
			throw new Meteor.Error('403', 'The information entered is not valid');
		}
		ProfilesServ.validateName(profile.name, profile._id);
	},
	/**
	 * Crea un nuevo perfil de usuario. Si ya existe lo actualiza.
	 * @param profile Información del perfil a crear.
	 */
	async run(profile: ProfileType) {
		const responseMessage = new ResponseMessage();
		if (profile._id) {//if exists then is created
			try {
				await ProfileCollection.updateAsync(profile._id,{
					$set:{
						name: profile.name,
						description: profile.description,
						permissions: profile.permissions
					}
				})
				responseMessage.create('Profile updated successfully!');
			} catch (exception) {
				console.error('profile.save: ', exception);
				throw new Meteor.Error('500', 'An error occurred while updating the profile');
			}
		} else { //Otherwise is created
			try {
				await ProfileCollection.insertAsync({
					name: profile.name,
					description: profile.description,
					permissions: profile.permissions
				})
				responseMessage.create('Profile created successfully!');
			} catch (exception) {
				console.error('profile.save: ', exception);
				throw new Meteor.Error('500', 'An error occurred while creating the new profile');
			}
		}
		return responseMessage;
	}
});

/**
 * @summary Delete a profile
 * @method profile.delete
 * @param profileId - {profileId:string}
 */
export const deleteProfileMethod = new ValidatedMethod({
	name: 'profile.delete',
	mixins: [MethodHooks],
	permissions: [Permissions.PROFILES.DELETE.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	validate({ profileId }: { profileId: string }) {
		try {
			check(profileId, String);
		} catch (exception) {
			console.error('profile.delete: ', exception);
			throw new Meteor.Error('403', 'The information entered is not valid');
		}
		const users = ProfilesServ.getUsersByProfile(profileId);
		if (users.length > 0) {
			throw new Meteor.Error('403', 'Profile cannot be removed', 'There are users using this profile');
		}
	},
	async run({ profileId }: { profileId: string }) {
		const responseMessage = new ResponseMessage();
		try {
			await ProfileCollection.removeAsync(profileId);
			responseMessage.create('Profile removed successfully!');
		} catch (exception) {
			console.error('profile.delete: ', exception);
			throw new Meteor.Error('500', 'An error occurred while removing the profile');
		}
		return responseMessage;
	}
});
