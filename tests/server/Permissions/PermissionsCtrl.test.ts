import chai from 'chai';
import { Roles } from 'meteor/alanning:roles';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/jessedev:cleaner';
import { Meteor } from 'meteor/meteor';
import Permissions from '../../../imports/api/Permissions/helpers/permissions.helpers';
import { StaticProfiles } from '../../../imports/api/Profiles/constants/static-profiles.constant';
import { initializeDatabaseForTest } from '../database/initializeDatabaseForTest';
import '/imports/api/app.module';
import { Profile } from '/imports/api/Profiles/profile.entity';

describe('PermissionsCtrl', function () {
	let adminUser: Meteor.User;
	let listPermissionsMethod: any;
	let listProfilePermissionsMethod: any;
	let listNotProfilePermissionsMethod: any;
	let profile: any;

	before(async function () {
		resetDatabase({ excludedCollections: ['roles', 'role-assignment', 'profiles'] });
		await initializeDatabaseForTest();
		adminUser = await Factory.createAsync<Meteor.User>('user');
		profile = await Factory.createAsync<Profile>('profile', { permissions: [Permissions.USERS.LIST.VALUE] });
		listPermissionsMethod = Meteor.server.method_handlers['permissions.list'];
		listProfilePermissionsMethod = Meteor.server.method_handlers['permissions.listByIdProfile'];
		listNotProfilePermissionsMethod = Meteor.server.method_handlers['permissions.listOthersForIdProfile'];
		await Roles.setUserRolesAsync(adminUser._id, StaticProfiles.admin.permissions, StaticProfiles.admin.name);
	});

	it('Lists all permissions', async function () {
		const response = await listPermissionsMethod.apply({ userId: adminUser._id });

		chai.assert.hasAllKeys(response, ['data']);
		chai.assert.isArray(response.data);

		response.data.forEach((permission: any) => {
			chai.assert.hasAllKeys(permission, ['_id', 'publicName', 'children', 'scope']);
			chai.assert.isString(permission._id);
			chai.assert.isString(permission.publicName);
			chai.assert.isArray(permission.children);
			chai.assert.isTrue(permission.scope === null || typeof permission.scope === 'string');
		});
	});

	it('Lists permissions by profile', async function () {
		const { data: response } = await listProfilePermissionsMethod.apply({ userId: adminUser._id }, [{ profileId: profile._id }]);
		const responseIds = response.map((permission: any) => permission._id);

		chai.assert.sameMembers(responseIds, profile.permissions);
	});

	it('Lists permissions not assigned to the profile', async function () {
		const allPermissions = await Roles.getAllRoles().fetchAsync();
		const { data: response } = await listNotProfilePermissionsMethod.apply({ userId: adminUser._id }, [{ profileId: profile._id }]);
		const responseIds = response.map((permission: any) => permission._id);
		const expectedLength = allPermissions.length - profile.permissions.length;

		chai.assert.equal(responseIds.length, expectedLength);
		profile.permissions.forEach((permissionId: string) => chai.assert.notInclude(responseIds, permissionId));
	});
});
