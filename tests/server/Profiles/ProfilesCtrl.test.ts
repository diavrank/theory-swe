import chai from 'chai';
import { Roles } from 'meteor/alanning:roles';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/jessedev:cleaner';
import { Meteor } from 'meteor/meteor';
import { StaticProfiles } from '../../../imports/api/Profiles/constants/static-profiles.constant';
import '/imports/api/app.module';
import { ProfilesPaginatedResponseDto } from '/imports/api/Profiles/dtos/profiles-paginated-response.dto';
import { Profile } from '/imports/api/Profiles/profile.entity';
import '/imports/api/Profiles/profiles.controller';
import { User } from '/imports/api/Users/user.entity';

describe('ProfilesCtrl', function () {
	let adminUser: User;
	let existingProfile: Profile;
	let saveProfileMethod: any;
	let deleteProfileMethod: any;
	let listNonExternalProfilesMethod: any;
	let listPaginatedProfilesMethod: any;

	before(async function () {
		resetDatabase({ excludedCollections: ['roles', 'role-assignment', 'profiles'] });
		adminUser = await Factory.createAsync<User>('user');
		existingProfile = await Factory.createAsync<Profile>('profile');
		saveProfileMethod = Meteor.server.method_handlers['profile.save'];
		deleteProfileMethod = Meteor.server.method_handlers['profile.delete'];
		listNonExternalProfilesMethod = Meteor.server.method_handlers['profile.listNonExternal'];
		listPaginatedProfilesMethod = Meteor.server.method_handlers['profile.listPaginated'];
		await Roles.setUserRolesAsync(adminUser._id, StaticProfiles.admin.permissions, StaticProfiles.admin.name);
	});

	describe('profile.save', function () {
		it('Create a new profile', async function () {
			const profile = Factory.tree<Profile>('profile');
			const response = await saveProfileMethod.apply({ userId: adminUser._id }, [profile]);
			chai.assert.equal(response.name, profile.name);

			await deleteProfile(response.id);
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

	describe('profile.listNonExternal', function () {
		it('List profiles excluding external ones', async function () {
			const externalProfileName = 'external-profile';
			const originalExternal = StaticProfiles.externalProfile;
			StaticProfiles.externalProfile = {
				name: externalProfileName,
				description: 'External profile',
				permissions: [],
				external: true
			};

			const [internalProfile, externalProfile] = await Promise.all([
				Factory.createAsync<Profile>('profile'),
				Factory.createAsync<Profile>('profile', { name: externalProfileName })
			]);

			try {
				const { data } = await listNonExternalProfilesMethod.apply({ userId: adminUser._id });
				const profileNames = data.map(profile => profile.name);

				chai.assert.include(profileNames, internalProfile.name);
				chai.assert.notInclude(profileNames, externalProfileName);
			} finally {
				if (originalExternal) {
					StaticProfiles.externalProfile = originalExternal;
				} else {
					// @ts-ignore
					delete StaticProfiles.externalProfile;
				}
				await Profile.collection.removeAsync({ _id: { $in: [internalProfile._id, externalProfile._id] } });
			}
		});
	});

	describe('profile.listPaginated', function () {
		it('List paginated profiles excluding static ones', async function () {
			const [firstProfile, secondProfile, thirdProfile] = await Promise.all([
				Factory.createAsync<Profile>('profile', { name: 'paginated-a', description: 'AA paginated profile' }),
				Factory.createAsync<Profile>('profile', { name: 'paginated-b', description: 'BB paginated profile' }),
				Factory.createAsync<Profile>('profile', { name: 'paginated-c', description: 'CC paginated profile' })
			]);
			const staticProfileNames = Object.keys(StaticProfiles).map((staticProfileName: string) => {
				return StaticProfiles[staticProfileName].name;
			});

			const expectedProfiles = await Profile.collection
				.find({ name: { $nin: staticProfileNames } }, { sort: { description: 1 } })
				.fetchAsync();

			try {
				const response: ProfilesPaginatedResponseDto = await listPaginatedProfilesMethod.apply({ userId: adminUser._id }, [{ page: 1, limit: 2 }]);

				chai.assert.equal(response.total, expectedProfiles.length);
				const expectedFirstPage = expectedProfiles.slice(0, 2).map(profile => profile._id);
				const responseIds = response.data.map((profile) => profile.id);

				chai.assert.deepEqual(responseIds, expectedFirstPage);
			} finally {
				await Profile.collection.removeAsync({
					_id: {
						$in: [firstProfile._id, secondProfile._id, thirdProfile._id]
					}
				});
			}
		});
	});

	describe('profile.delete', function () {
		it('Delete a profile', async function () {
			const numberOfDeletedItems = await deleteProfile(existingProfile._id);
			chai.assert.equal(numberOfDeletedItems, 1);
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

	async function deleteProfile(profileId: string): Promise<number> {
		return deleteProfileMethod.apply({ userId: adminUser._id }, [{ profileId }]);
	}
});
