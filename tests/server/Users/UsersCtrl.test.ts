import chai from 'chai';
import faker from 'faker';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/jessedev:cleaner';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import sinon from 'sinon';
import { StaticProfiles } from '../../../imports/api/Profiles/constants/static-profiles.constant';
import '../../../imports/api/Users/users.controller';
import '/imports/api/app.module';
import { UserRequestDto } from '/imports/api/Users/dtos/user-request.dto';

describe('UsersCtrl', function () {
	let adminId: string;
	let existingUser: Meteor.User;
	let existingEmail = faker.internet.email();
	let existingUsername = faker.internet.userName();
	let saveUserMethod: any;
	let updatePersonalDataMethod: any;
	let deleteUserMethod: any;

	before(async function () {
		resetDatabase({ excludedCollections: ['roles', 'role-assignment', 'profiles'] });
		adminId = await Accounts.createUserAsync(Factory.tree('user'));
		existingUser = <Meteor.User>await Factory.createAsync('user', {
			'emails': [{ address: existingEmail, verified: false }],
			'username': existingUsername
		});
		// TODO: fix Meteor.server type
		saveUserMethod = Meteor.server.method_handlers['user.save'];
		updatePersonalDataMethod = Meteor.server.method_handlers['user.updatePersonalData'];
		deleteUserMethod = Meteor.server.method_handlers['user.delete'];
		// Ensure admin has the required permissions for the guarded methods
		await Roles.setUserRolesAsync(adminId, StaticProfiles.admin.permissions, StaticProfiles.admin.name);
		sinon.stub(Accounts, 'sendEnrollmentEmail').returns();
		sinon.stub(Accounts, 'sendVerificationEmail').returns();
	});

	after(function () {
		sinon.restore();
	});

	describe('user.save', function () {
		it('Create a new user without image', async function () {
			const newUser = Factory.tree<UserRequestDto>('simpleUser');
			const response = await saveUserMethod.apply({ userId: adminId }, [{ user: newUser }]);
			chai.assert.equal(response.email, newUser.email, 'User created!');
		});

		it('Update a user', async function () {
			const userToBeUpdated = <UserRequestDto>Factory.tree('simpleUser', {
				email: existingEmail,
				username: existingUsername
			});
			userToBeUpdated.id = existingUser._id;
			const response = await saveUserMethod.apply({ userId: adminId }, [{ user: userToBeUpdated }]);
			chai.assert.equal(response.id, existingUser._id, 'User updated!');
		});

		it('Email already exists', async function () {
			const newUser = Factory.tree('simpleUser', { email: existingEmail });
			try {
				await saveUserMethod.apply({ userId: adminId }, [{ user: newUser }]);
				chai.assert.fail('Expected Meteor.Error for duplicated email');
			} catch (error: any) {
				chai.assert.instanceOf(error, Meteor.Error);
				chai.assert.equal(error.reason, 'The new email is already in use');
			}
		});

		it('Username already exists', async function () {
			const newUser = Factory.tree('simpleUser', { 'username': existingUsername });
			try {
				await saveUserMethod.apply({ userId: adminId }, [{ user: newUser }]);
				chai.assert.fail('Expected Meteor.Error for duplicated username');
			} catch (error: any) {
				chai.assert.instanceOf(error, Meteor.Error);
				chai.assert.equal(error.reason, 'The new username is already in use');
			}
		});

	});

	describe('user.updatePersonalData', function () {
		it('Update personal data of user logged in.', async function () {
			const newUserData = <UserRequestDto>Factory.tree('simpleUser');
			const response = await updatePersonalDataMethod.apply({ userId: adminId }, [{ user: newUserData }]);
			chai.assert.equal(response.email, newUserData.email, 'Information updated!');
		});

		it('Username already exists', async function () {
			const newUserData = Factory.tree('simpleUser', { 'username': existingUsername });
			try {
				await updatePersonalDataMethod.apply({ userId: adminId }, [{ user: newUserData }]);
				chai.assert.fail('Expected Meteor.Error for duplicated username');
			} catch (error: any) {
				chai.assert.instanceOf(error, Meteor.Error);
				chai.assert.equal(error.reason, 'The new username is already in use');
			}
		});

		it('Email already exists', async function () {
			const newUserData = Factory.tree('simpleUser', { email: existingEmail });
			try {
				await updatePersonalDataMethod.apply({ userId: adminId }, [{ user: newUserData }]);
				chai.assert.fail('Expected Meteor.Error for duplicated email');
			} catch (error: any) {
				chai.assert.instanceOf(error, Meteor.Error);
				chai.assert.equal(error.reason, 'The new email is already in use');
			}
		});
	});

	describe('user.delete', function () {
		it('Delete a user', async function () {
			const responseMessage = await deleteUserMethod.apply({ userId: adminId }, [{ userId: existingUser._id }]);
			chai.assert.equal(responseMessage.message, 'Record deleted!', 'User removed successfully!');
		});
		it('User does not exist', async function () {
			try {
				await deleteUserMethod.apply({ userId: adminId }, [{ userId: Random.id(10) }]);
				chai.assert.fail('Expected Meteor.Error for user not found');
			} catch (error: any) {
				chai.assert.instanceOf(error, Meteor.Error);
				chai.assert.equal(error.reason, 'Document not found');
			}
		});
	});
});
