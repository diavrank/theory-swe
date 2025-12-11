import { Meteor } from 'meteor/meteor';
import Utilities from '../../startup/server/utils/helpers';
import { UserPresence } from './userPresence';

// If `sessionIds` is undefined this signifies we need a fresh start.
// When a full cleanup is necessary we will unset the status field to show all users as offline
UserPresence.onCleanup(function onCleanup(sessionIds?: string[]) {
	if (!sessionIds) {
		Meteor.users.updateAsync({}, { $set: { 'status.online': false }, $unset: { 'status.idle': true } }, { multi: true });
	}
});

// When a user comes online we set their status to online and set the lastOnline field to the current time
UserPresence.onUserOnline(function onUserOnline(userId: string, connection?: Meteor.Connection) {
	if (connection) {
		Meteor.users.updateAsync(userId, {
			$set: {
				'status.online': true,
				'status.idle': false,
				'status.lastLogin.date': Utilities.currentLocalDate(),
				'status.lastLogin.ipAddress': connection.clientAddress,
				// @ts-ignore
				'status.lastLogin.userAgent': connection.httpHeaders['user-agent']
			}
		});
	}
});

// When a user goes idle we'll set their status to indicate this
UserPresence.onUserIdle(function onUserIdle(userId: string) {
	Meteor.users.updateAsync(userId, { $set: { 'status.idle': true } });
});

// When a user goes offline we'll unset their status field to indicate offline status
UserPresence.onUserOffline(function onUserOffline(userId: string) {
	Meteor.users.updateAsync(userId, { $set: { 'status.online': false }, $unset: { 'status.idle': true } });
});
