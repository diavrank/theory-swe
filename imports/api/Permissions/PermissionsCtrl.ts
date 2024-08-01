import AuthGuard from '../../middlewares/AuthGuard';
import { check } from 'meteor/check';

//Permisos
import Permissions from '../../startup/server/Permissions';
import Binnacle from '../../middlewares/Binnacle';
import {ProfileCollection, ProfileType} from "@api/Profiles/ProfileCollection";
import PermissionsService from "@api/Permissions/PermissionsServ";
import {createMethod} from 'meteor/jam:method';


const permissionsService = new PermissionsService();

/**
 * @summary List all permissions of the system
 * @method permissions.list
 * @return
 */
export const listPermissionsMethod = createMethod({
	name: 'permissions.list',
	before: [Binnacle.checkIn, AuthGuard.checkPermission([Permissions.PERMISSIONS.LIST.VALUE])],
	after: [Binnacle.checkOut],
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
export const listProfilePermissionsMethod = createMethod({
	name: 'permissions.listByIdProfile',
	before: [Binnacle.checkIn, AuthGuard.checkPermission([Permissions.PERMISSIONS.LIST.VALUE])],
	after: [Binnacle.checkOut],
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
export const listNotProfilePermissionsMethod = createMethod({
	name: 'permissions.listOthersForIdProfile',
	before: [Binnacle.checkIn, AuthGuard.checkPermission([Permissions.PERMISSIONS.LIST.VALUE])],
	after: [Binnacle.checkOut],
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
