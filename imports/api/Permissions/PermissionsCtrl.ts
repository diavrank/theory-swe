import { ValidatedMethod } from 'meteor/mdg:validated-method';
import AuthGuard from '../../middlewares/AuthGuard';
import { Profile } from '../Profiles/Profile';
import { check } from 'meteor/check';

//Permisos
import Permissions from '../../startup/server/Permissions';
import Binnacle from '../../middlewares/Binnacle';

/**
 * @summary List all permissions of the system
 * @method permissions.list
 * @return Array of {@link RoleType}
 */
export const listPermissionsMethod = new ValidatedMethod({
	name: 'permissions.list',
	mixins: [MethodHooks],
	permissions: [Permissions.PERMISSIONS.LIST.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	validate: null,
	run() {
		return Meteor.roles.find({}).fetch();
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
	validate({ profileId }: { profileId: string }) {
		try {
			check(profileId, String);
		} catch (exception) {
			console.error('permissions.listByIdProfile: ', exception);
			throw new Meteor.Error('403', 'The information entered is not valid');
		}
		if (!Profile.findOne(profileId)) {
			throw new Meteor.Error('403', 'Profile does not exist');
		}
	},
	run({ profileId }: { profileId: string }) {
		const profile = Profile.findOne(profileId);
		return profile.getPermissions().fetch();
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
	validate({ profileId }: { profileId: string }) {
		try {
			check(profileId, String);
		} catch (exception) {
			console.error('permissions.listOthersForIdProfile: ', exception);
			throw new Meteor.Error('403', 'The information entered is not valid');
		}
		if (!Profile.findOne(profileId)) {
			throw new Meteor.Error('403', 'Profile does not exist');
		}
	},
	run({ profileId }: { profileId: string }) {
		const profile = Profile.findOne(profileId);
		return profile.getPermissionsComplement().fetch();
	}
});
