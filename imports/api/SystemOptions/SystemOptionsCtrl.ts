import { Meteor } from 'meteor/meteor';
import SystemOptions from './SystemOption';
// @ts-ignore
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

/**
 * Regresa las opciones del sistema asociadas a un usuario dependiendo de sus permisos.
 */
export const getSystemOptionsMethod = new ValidatedMethod({
	name: 'getSystemOptions',
	validate: null,
	run() {
		let data = {};
		if (this.userId) {
			const userLogged = <Meteor.User>Meteor.users.findOne(this.userId);
			data = SystemOptions
				.getSystemOptionsByUserRoles(Roles.getRolesForUser(userLogged?._id, userLogged?.profile.profile));
		} else {
			data = [];
		}
		return data;
	}
});
