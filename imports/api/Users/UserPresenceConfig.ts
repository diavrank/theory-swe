import { UserPresence } from 'meteor-user-presence';
import { Meteor } from 'meteor/meteor';
import Utilities from '../../startup/server/utils/helpers';
import { User } from './user.entity';

// TODO: Maybe this file should be moved to the auth.module.ts

// If `sessionIds` is undefined this signifies we need a fresh start.
// When a full cleanup is necessary we will unset the status field to show all users as offline
UserPresence.onCleanup(function onCleanup(sessionIds?: string[]) {
	if (!sessionIds) {
		User.collection.updateAsync({}, { $set: { 'status.online': false }, $unset: { 'status.idle': true } }, { multi: true });
	}
});

// When a user comes online we set their status to online and set the lastOnline field to the current time
UserPresence.onUserOnline(function onUserOnline(userId: string, connection?: Meteor.Connection) {
	if (connection) {
		User.collection.updateAsync(userId, {
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
	User.collection.updateAsync(userId, { $set: { 'status.idle': true } });
});

// When a user goes offline we'll unset their status field to indicate offline status
UserPresence.onUserOffline(function onUserOffline(userId: string) {
	User.collection.updateAsync(userId, { $set: { 'status.online': false }, $unset: { 'status.idle': true } });
});
