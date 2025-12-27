import chai from 'chai';
import { Roles } from 'meteor/alanning:roles';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/jessedev:cleaner';
import { Meteor } from 'meteor/meteor';
import Permissions from '../../../imports/api/Permissions/helpers/permissions.helpers';
import { StaticProfiles } from '../../../imports/api/Profiles/constants/static-profiles.constant';
import '/imports/api/app.module';

describe('AuthCtrl', function () {
	let userWithPermission: Meteor.User;
	let checkPermissionMethod: any;

	before(async function () {
		resetDatabase({ excludedCollections: ['roles', 'role-assignment', 'profiles'] });
		userWithPermission = <Meteor.User>await Factory.createAsync('user');
		checkPermissionMethod = Meteor.server.method_handlers['auth.checkPermission'];
		await Roles.setUserRolesAsync(userWithPermission._id, [Permissions.USERS.LIST.VALUE], StaticProfiles.admin.name);
	});

	it('Returns true when the user has the permission', async function () {
		const { hasPermission } = await checkPermissionMethod.apply({ userId: userWithPermission._id }, [{ permission: Permissions.USERS.LIST.VALUE }]);
		chai.assert.isTrue(hasPermission);
	});

	it('Returns false when the user does not have the permission', async function () {
		const userWithoutPermission = await Factory.createAsync<Meteor.User>('user');
		await Roles.setUserRolesAsync(userWithoutPermission._id, [Permissions.USERS.LIST.VALUE], StaticProfiles.admin.name);

		const { hasPermission } = await checkPermissionMethod.apply({ userId: userWithoutPermission._id }, [{ permission: Permissions.PROFILES.LIST.VALUE }]);
		chai.assert.isFalse(hasPermission);
	});
});
