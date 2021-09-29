import { Meteor } from 'meteor/meteor';

/**
 * @summary List all permissions of an authenticated user
 * @publication roles
 *
 */
Meteor.publish('roles', function() {
	// @ts-ignore
	return Meteor.roleAssignment.find({ 'user._id': this.userId });
});
