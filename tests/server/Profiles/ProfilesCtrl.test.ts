import chai from 'chai';
import { Roles } from 'meteor/alanning:roles';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/jessedev:cleaner';
import { Meteor } from 'meteor/meteor';
import { StaticProfiles } from '../../../imports/api/Profiles/constants/static-profiles.constant';
import '/imports/api/app.module';
import { Profile } from '/imports/api/Profiles/profile.entity';
import '/imports/api/Profiles/profiles.controller';
import { User } from '/imports/api/Users/user.entity';

describe('ProfilesCtrl', function () {
	let adminUser: User;
	let existingProfile: Profile;
	let saveProfileMethod: any;
	let deleteProfileMethod: any;

	before(async function () {
		resetDatabase({ excludedCollections: ['roles', 'role-assignment', 'profiles'] });
		adminUser = <User>await Factory.createAsync('user');
		existingProfile = <Profile>await Factory.createAsync('profile');
		saveProfileMethod = Meteor.server.method_handlers['profile.save'];
		deleteProfileMethod = Meteor.server.method_handlers['profile.delete'];
		await Roles.setUserRolesAsync(adminUser._id, StaticProfiles.admin.permissions, StaticProfiles.admin.name);
	});

	after(function () {
		resetDatabase();
	});

	describe('profile.save', function () {
		it('Create a new profile', async function () {
			const profile = Factory.tree('profile');
			const response = await saveProfileMethod.apply({ userId: adminUser._id }, [profile]);
			chai.assert.equal(response.name, profile.name);
		});

		it('Profile name already exists', async function () {
			const profile = Factory.tree('profile', { name: existingProfile.name });
			try {
				await saveProfileMethod.apply({ userId: adminUser._id }, [profile]);
				chai.assert.fail('Expected Meteor.Error for duplicated profile name');
			} catch (error: any) {
				chai.assert.instanceOf(error, Meteor.Error);
				chai.assert.equal(error.reason, 'The profile name already exists');
			}
		});

		it('Update a profile', async function () {
			let profileToBeUpdated = Factory.tree<Profile>('profile');
			profileToBeUpdated._id = existingProfile._id;
			const newProfileDto = { ...profileToBeUpdated, id: existingProfile._id }
			const response = await saveProfileMethod.apply({ userId: adminUser._id }, [newProfileDto]);
			chai.assert.equal(response.id, existingProfile._id);
		});
	});

	describe('profile.delete', function () {
		it('Delete a profile', async function () {
			await deleteProfileMethod.apply({ userId: adminUser._id }, [{ profileId: existingProfile._id }]);
			chai.assert.isTrue(true);
		});

		it('Profile cannot be removed', async function () {
			const profile = await Profile.collection.findOneAsync({ name: StaticProfiles.admin.name });
			try {
				await deleteProfileMethod.apply({ userId: adminUser._id }, [{ profileId: profile._id }]);
				chai.assert.fail('Expected Meteor.Error for restricted profile');
			} catch (error: any) {
				chai.assert.instanceOf(error, Meteor.Error);
				chai.assert.equal(error.reason, 'Cannot delete profile: There are users using this profile');
			}
		});
	});
});
