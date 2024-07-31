import { ValidatedMethod } from 'meteor/mdg:validated-method';
import AuthGuard from '../../middlewares/AuthGuard';
import { check } from 'meteor/check';

//Permisos
import Permissions from '../../startup/server/Permissions';
import Binnacle from '../../middlewares/Binnacle';
import {ProfileCollection, ProfileType} from "@api/Profiles/ProfileCollection";
import PermissionsService from "@api/Permissions/PermissionsServ";


const permissionsService = new PermissionsService();

/**
 * @summary List all permissions of the system
 * @method permissions.list
 * @return
 */
export const listPermissionsMethod = new ValidatedMethod({
	name: 'permissions.list',
	mixins: [MethodHooks],
	permissions: [Permissions.PERMISSIONS.LIST.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	validate: null,
	async run() {
		return Meteor.roles.find({}).fetchAsync();
	}
});

/**
 * @summary List permissions of a profile
 * @method permissions.listByIdProfile
 * @param profileId - {profileId:string}
 * @return Array of {@link RoleType}
 */
export const listProfilePermissionsMethod = new ValidatedMethod({
	name: 'permissions.listByIdProfile',
	mixins: [MethodHooks],
	permissions: [Permissions.PERMISSIONS.LIST.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	async validate({ profileId }: { profileId: string }) {
		try {
			check(profileId, String);
		} catch (exception) {
			console.error('permissions.listByIdProfile: ', exception);
			throw new Meteor.Error('403', 'The information entered is not valid');
		}
		if (!await ProfileCollection.findOneAsync(profileId)) {
			throw new Meteor.Error('403', 'Profile does not exist');
		}
	},
	async run({ profileId }: { profileId: string }) {
		const profile = await ProfileCollection.findOneAsync(profileId) as ProfileType;
		return permissionsService.getPermissions(profile.permissions).fetchAsync();

	}
});

/**
 * @summary List permissions not associated to a profile
 * @method permissions.listOthersForIdProfile
 * @param profileId - {profileId:string}
 * @return Array of {@link RoleType}
 */
export const listNotProfilePermissionsMethod = new ValidatedMethod({
	name: 'permissions.listOthersForIdProfile',
	mixins: [MethodHooks],
	permissions: [Permissions.PERMISSIONS.LIST.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	async validate({ profileId }: { profileId: string }) {
		try {
			check(profileId, String);
		} catch (exception) {
			console.error('permissions.listOthersForIdProfile: ', exception);
			throw new Meteor.Error('403', 'The information entered is not valid');
		}
		if (!await ProfileCollection.findOneAsync(profileId)) {
			throw new Meteor.Error('403', 'Profile does not exist');
		}
	},
	async run({ profileId }: { profileId: string }) {
		const profile = await ProfileCollection.findOneAsync(profileId) as ProfileType;
		return permissionsService.getPermissionsComplement(profile.permissions).fetchAsync();
	}
});
