import { Random } from 'meteor/random';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { deleteUserMethod, saveUserMethod, updatePersonalDataMethod } from '/imports/api/Users/UsersCtrl';
import { Factory } from 'meteor/dburles:factory';
import chai from 'chai';
import sinon from 'sinon';
import faker from 'faker';
import { User } from '/imports/api/Users/User';

describe('UsersCtrl', function() {
	let adminId: string;
	let existingUser: Meteor.User;
	let existingEmail = faker.internet.email();
	let existingUsername = faker.internet.userName();

	before(function() {
		resetDatabase({ excludedCollections: ['roles', 'role-assignment', 'profiles'] });
		const userAdmin = new User(Factory.tree('user'));
		userAdmin.save();
		adminId = userAdmin._id;
		existingUser = <Meteor.User>Factory.create('user', {
			'emails': [{ address: existingEmail, verified: false }],
			'username': existingUsername
		});
		sinon.stub(Accounts, 'sendEnrollmentEmail').returns();
		sinon.stub(Accounts, 'sendVerificationEmail').returns();
	});

	describe('user.save', function() {
		it('Create a new user without image', async function() {
			const newUser = Factory.tree<Meteor.User>('simpleUser');
			const responseMessage = await saveUserMethod._execute({ userId: adminId }, { user: newUser });
			chai.assert.equal(responseMessage.message, 'User created!', 'User created!');
		});

		it('Update a user', async function() {
			const userToBeUpdated = <Meteor.User>Factory.tree('simpleUser', {
				'emails': [{ address: existingEmail, verified: false }],
				'username': existingUsername
			});
			userToBeUpdated._id = existingUser._id;
			const responseMessage = await saveUserMethod._execute({ userId: adminId }, { user: userToBeUpdated });
			chai.assert.equal(responseMessage.message, 'User updated!', 'User updated!');
		});

		it('Email already exists', function() {
			const newUser = Factory.tree('simpleUser', { 'emails': [{ address: existingEmail, verified: false }] });
			chai.assert.throws(() => {
				saveUserMethod._execute({ userId: adminId }, { user: newUser });
			}, Meteor.Error, 'The new email is already in use');
		});

		it('Username already exists', function() {
			const newUser = Factory.tree('simpleUser', { 'username': existingUsername });
			chai.assert.throws(() => {
				saveUserMethod._execute({ userId: adminId }, { user: newUser });
			}, Meteor.Error, 'The new username is already in use');
		});

	});

	describe('user.updatePersonalData', function() {
		it('Update personal data of user logged in', async function() {
			const newUserData = <Meteor.User>Factory.tree('simpleUser');
			const responseMessage = await updatePersonalDataMethod._execute({ userId: adminId }, { user: newUserData });
			chai.assert.equal(responseMessage.message, 'Information updated!','Information updated!');
		});

		it('Username already exists', function() {
			const newUserData = Factory.tree('simpleUser', { 'username': existingUsername });
			chai.assert.throws(() => {
				updatePersonalDataMethod._execute({ userId: adminId }, { user: newUserData });
			}, Meteor.Error, 'The new username is already in use');
		});

		it('Email already exists', function() {
			const newUserData = Factory.tree('simpleUser', { 'emails': [{ address: existingEmail, verified: false }] });
			chai.assert.throws(() => {
				updatePersonalDataMethod._execute({ userId: adminId }, { user: newUserData });
			}, Meteor.Error, 'The new email is already in use');
		});
	});

	describe('user.delete', function() {
		it('Delete a user', function() {
			const responseMessage = deleteUserMethod._execute({ userId: adminId }, { userId: existingUser._id });
			chai.assert.equal(responseMessage.message, 'User removed successfully!', 'User removed successfully!');
		});
		it('User does not exist', function() {
			chai.assert.throws(() => {
				deleteUserMethod._execute({ userId: adminId }, { userId: Random.id(10) });
			}, Meteor.Error, 'User does not exists');
		});
	});
});
