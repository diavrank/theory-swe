import chai from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { StaticProfiles } from '../../../imports/backfills/recurring/RefreshStaticProfilesBackfill';
import { Profile } from '/imports/api/Profiles/profile.entity';
import { deleteProfileMethod, saveProfileMethod } from '/imports/api/Profiles/ProfilesCtrl';
import { User } from '/imports/api/Users/user.entity';

describe('ProfilesCtrl', function () {
	let adminUser: User;
	let existingProfile: Profile;

	before(function () {
		adminUser = <User>Factory.create('user')
		existingProfile = <Profile>Factory.create('profile');
	});

	after(function () {
		resetDatabase();
	});

	describe('profile.save', function () {
		it('Create a new profile', function () {
			const profile = Factory.tree('profile');
			const responseMessage = saveProfileMethod._execute({ userId: adminUser._id }, profile);
			chai.assert.equal(responseMessage.message, 'Profile created successfully!');
		});

		it('Profile name already exists', function () {
			const profile = Factory.tree('profile', { name: existingProfile.name });
			chai.assert.throws(() => {
				saveProfileMethod._execute({ userId: adminUser._id }, profile);
			}, Meteor.Error, 'Sorry! The new profile name already exists, please use another.');
		});

		it('Update a profile', function () {
			let profileToBeUpdated = Factory.tree<Profile>('profile');
			profileToBeUpdated._id = existingProfile._id;
			const responseMessage = saveProfileMethod._execute({ userId: adminUser._id }, profileToBeUpdated);
			chai.assert.equal(responseMessage.message, 'Profile updated successfully!');
		});
	});

	describe('profile.delete', function () {
		it('Delete a profile', function () {
			const responseMessage = deleteProfileMethod._execute({ userId: adminUser._id }, { profileId: existingProfile._id });
			chai.assert.equal(responseMessage.message, 'Profile removed successfully!');
		});

		it('Profile cannot be removed', async function () {
			const profile = await Profile.collection.findOneAsync({ name: StaticProfiles.admin.name });
			chai.assert.throws(() => {
				deleteProfileMethod._execute({ userId: adminUser._id }, { profileId: profile._id });
			}, Meteor.Error, 'Profile cannot be removed');
		});
	});
});
