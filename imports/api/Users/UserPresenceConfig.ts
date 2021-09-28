import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { User } from 'meteor/socialize:user-model';
// @ts-ignore
import { UserPresence } from 'meteor/socialize:user-presence';
import Utilities from '../../startup/server/utils/helpers';
// @ts-ignore
import SimpleSchema from 'simpl-schema';

// Schema for the fields where we will store the status data
const StatusSchema = new SimpleSchema({
	status: Object,
	'status.online': { type: Boolean },
	'status.idle': { type: Boolean, optional: true },
	'status.lastLogin': { type: Object, optional: true, blackbox: true }
});

// Add the schema to the existing schema currently attached to the User model
User.attachSchema(StatusSchema);

// If `sessionIds` is undefined this signifies we need a fresh start.
// When a full cleanup is necessary we will unset the status field to show all users as offline
UserPresence.onCleanup(function onCleanup(sessionIds: any) {
	if (!sessionIds) {
		Meteor.users.update({}, { $set: { 'status.online': false }, $unset: { 'status.idle': true } }, { multi: true });
	}
});

// When a user comes online we set their status to online and set the lastOnline field to the current time
UserPresence.onUserOnline(function onUserOnline(userId: string, connection: Meteor.Connection) {
	if (connection) {
		Meteor.users.update(userId, {
			$set: {
				'status.online': true,
				'status.idle': false,
				'status.lastLogin.date': Utilities.currentLocalDate(),
				'status.lastLogin.ipAddr': connection.clientAddress,
				// @ts-ignore
				'status.lastLogin.userAgent': connection.httpHeaders['user-agent']
			}
		});
	}
});

// When a user goes idle we'll set their status to indicate this
UserPresence.onUserIdle(function onUserIdle(userId: string) {
	Meteor.users.update(userId, { $set: { 'status.idle': true } });
});

// When a user goes offline we'll unset their status field to indicate offline status
UserPresence.onUserOffline(function onUserOffline(userId: string) {
	Meteor.users.update(userId, { $set: { 'status.online': false }, $unset: { 'status.idle': true } });
});
