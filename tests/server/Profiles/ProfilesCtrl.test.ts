import { resetDatabase } from 'meteor/xolvio:cleaner';
import { User, UserType } from '/imports/api/Users/User';
import { Factory } from 'meteor/dburles:factory';
import { deleteProfileMethod, saveProfileMethod } from '/imports/api/Profiles/ProfilesCtrl';
import { Profile } from '/imports/api/Profiles/Profile';
import chai from 'chai';
import { StaticProfiles } from '/imports/api/Profiles/ProfileSeeder';
import { ProfileType } from '/imports/api/Profiles/ProfileCollection';

describe('ProfilesCtrl', function() {
	let adminUser: MeteorAstronomy.Model<UserType>;
	let existingProfile: ProfileType;

	before(function() {
		adminUser = new User(Factory.tree('user'));
		adminUser.save();
		existingProfile = <ProfileType>Factory.create('profile');
	});

	after(function() {
		resetDatabase();
	});

	describe('profile.save', function() {
		it('Create a new profile', function() {
			const profile = Factory.tree('profile');
			const responseMessage = saveProfileMethod._execute({ userId: adminUser._id }, profile);
			chai.assert.equal(responseMessage.message, 'Profile created successfully!');
		});

		it('Profile name already exists', function() {
			const profile = Factory.tree('profile', { name: existingProfile.name });
			chai.assert.throws(() => {
				saveProfileMethod._execute({ userId: adminUser._id }, profile);
			}, Meteor.Error, 'Sorry! The new profile name already exists, please use another.');
		});

		it('Update a profile', function() {
			let profileToBeUpdated = Factory.tree<ProfileType>('profile');
			profileToBeUpdated._id = existingProfile._id;
			const responseMessage = saveProfileMethod._execute({ userId: adminUser._id }, profileToBeUpdated);
			chai.assert.equal(responseMessage.message, 'Profile updated successfully!');
		});
	});

	describe('profile.delete', function() {
		it('Delete a profile', function() {
			const responseMessage = deleteProfileMethod._execute({ userId: adminUser._id }, { profileId: existingProfile._id });
			chai.assert.equal(responseMessage.message, 'Profile removed successfully!');
		});

		it('Profile cannot be removed', function() {
			const profile = Profile.findOne({ name: StaticProfiles.admin.name });
			chai.assert.throws(() => {
				deleteProfileMethod._execute({ userId: adminUser._id }, { profileId: profile._id });
			}, Meteor.Error, 'Profile cannot be removed');
		});
	});
});
