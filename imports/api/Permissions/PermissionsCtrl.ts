import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import AuthGuard from '../../middlewares/AuthGuard';
import { ProfileCollection, ProfileType } from '../Profiles/Profile';

//Permisos
import Permissions from '../../startup/server/Permissions';
import Binnacle from '../../middlewares/Binnacle';

/**
 * @summary List all permissions of the system
 * @method permissions.list
 * @return Array of {@link ProfileType}
 */
export const listPermissionsMethod = new ValidatedMethod({
	name: 'permissions.list',
	mixins: [MethodHooks],
	permissions: [Permissions.PERMISSIONS.LIST.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	validate: null,
	/**
	 * Lista todos los permisos del sistema
	 */
	run(): Array<ProfileType> {
		return Meteor.roles.find({}).fetch();
	}
});

/**
 * @summary List permissions of a profile
 * @method permissions.listByIdProfile
 * @param idProfile - {idProfile:string}
 * @return Array of {@link ProfileType}
 */
export const listProfilePermissionsMethod = new ValidatedMethod({
	name: 'permissions.listByIdProfile',
	// @ts-ignore
	mixins: [MethodHooks],
	permissions: [Permissions.PERMISSIONS.LIST.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	validate: null,
	run({ idProfile }: { idProfile: string }): Array<ProfileType> {
		let permissions = [];
		if (idProfile) {
			const profile = ProfileCollection.findOne(idProfile);
			permissions = Meteor.roles.find({ _id: { $in: profile?.permissions } }).fetch();
		}
		return permissions;
	}
});

/**
 * @summary List permissions not associated to a profile
 * @method permissions.listOthersForIdProfile
 * @param idProfile - {idProfile:string}
 * @return Array of {@link ProfileType}
 */
export const listNotProfilePermissionsMethod = new ValidatedMethod({
	name: 'permissions.listOthersForIdProfile',
	// @ts-ignore
	mixins: [MethodHooks],
	permissions: [Permissions.PERMISSIONS.LIST.VALUE],
	beforeHooks: [Binnacle.checkIn, AuthGuard.checkPermission],
	afterHooks: [Binnacle.checkOut],
	validate: null,
	/**
	 * Lista los permisos que no están asociados a un perfil
	 * @param idProfile
	 */
	run({ idProfile }: { idProfile: string }): Array<ProfileType> {
		let permissions = [];
		if (idProfile) {
			const profile = ProfileCollection.findOne(idProfile);
			permissions = Meteor.roles.find({ _id: { $not: { $in: profile?.permissions } } }).fetch();
		}
		return permissions;
	}
});
