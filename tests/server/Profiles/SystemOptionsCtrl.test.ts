import chai from 'chai';
import { Roles } from 'meteor/alanning:roles';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/jessedev:cleaner';
import { Meteor } from 'meteor/meteor';
import { StaticProfiles } from '../../../imports/api/Profiles/constants/static-profiles.constant';
import { systemOptions } from '../../../imports/api/Profiles/constants/system-options.constants';
import { initializeDatabaseForTest } from '../database/initializeDatabaseForTest';
import '/imports/api/app.module';

describe('SystemOptionsCtrl', function () {
	let adminUser: Meteor.User;
	let getSystemOptionsMethod: any;

	before(async function () {
		resetDatabase({ excludedCollections: ['roles', 'role-assignment', 'profiles'] });
		await initializeDatabaseForTest();
		adminUser = await Factory.createAsync<Meteor.User>('user');
		getSystemOptionsMethod = Meteor.server.method_handlers['profile.getSystemOptions'];
		await Roles.setUserRolesAsync(adminUser._id, StaticProfiles.admin.permissions, StaticProfiles.admin.name);
	});

	it('Returns all options for admin users', async function () {
		const { data: response } = await getSystemOptionsMethod.apply({ userId: adminUser._id });
		const returnedPermissions = response.map((option: any) => option.permission);
		chai.assert.equal(response.length, systemOptions.length);
		chai.assert.sameMembers(returnedPermissions, systemOptions.map(option => option.permission));
	});

	it('Filters options by user permissions', async function () {
		const limitedProfileName = 'limited-system-options';
		const limitedPermissions = [systemOptions[0].permission];
		const limitedUser = await Factory.createAsync<Meteor.User>('user', {
			profile: { name: 'Limited User', profile: limitedProfileName }
		});
		await Roles.setUserRolesAsync(limitedUser._id, limitedPermissions, limitedProfileName);

		const { data: response } = await getSystemOptionsMethod.apply({ userId: limitedUser._id });
		const returnedPermissions = response.map((option: any) => option.permission);

		chai.assert.sameMembers(returnedPermissions, limitedPermissions);
	});
});
