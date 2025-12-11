import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

type SessionStatus = 'online' | 'idle';
type CleanupHandler = (sessionIds?: string[]) => void;
type StatusHandler = (userId: string, connection?: Meteor.Connection) => void;

interface SessionInfo {
	userId: string;
	status: SessionStatus;
	connection?: Meteor.Connection;
}

const cleanupHandlers: CleanupHandler[] = [];
const onlineHandlers: StatusHandler[] = [];
const idleHandlers: StatusHandler[] = [];
const offlineHandlers: StatusHandler[] = [];

const sessions = new Map<string, SessionInfo>();
const userStates = new Map<string, SessionStatus | 'offline'>();

const assertFunction = (fn: unknown, message: string) => {
	if (typeof fn !== 'function') {
		throw new Meteor.Error('not-a-function', message);
	}
};

const runCleanup = (sessionIds?: string[]) => {
	cleanupHandlers.forEach((handler) => handler(sessionIds));
};

const emitStatus = (userId: string, connection?: Meteor.Connection) => {
	const userSessions = Array.from(sessions.values()).filter((session) => session.userId === userId);
	const nextStatus: SessionStatus | 'offline' = userSessions.length === 0
		? 'offline'
		: userSessions.some((session) => session.status === 'online') ? 'online' : 'idle';

	const previousStatus = userStates.get(userId) ?? 'offline';
	if (previousStatus === nextStatus) {
		return;
	}

	userStates.set(userId, nextStatus);

	if (nextStatus === 'online') {
		onlineHandlers.forEach((handler) => handler(userId, connection));
	} else if (nextStatus === 'idle') {
		idleHandlers.forEach((handler) => handler(userId, connection));
	} else {
		offlineHandlers.forEach((handler) => handler(userId, connection));
	}
};

const setSessionStatus = (sessionId: string, userId: string, status: SessionStatus, connection?: Meteor.Connection) => {
	sessions.set(sessionId, { userId, status, connection });
	emitStatus(userId, connection);
};

const removeSession = (sessionId: string, connection?: Meteor.Connection) => {
	const session = sessions.get(sessionId);
	if (!session) {
		return;
	}

	sessions.delete(sessionId);
	emitStatus(session.userId, connection);
};

const removeAllSessionsForUser = (userId: string, connection?: Meteor.Connection) => {
	let removed = false;
	sessions.forEach((session, sessionId) => {
		if (session.userId === userId) {
			sessions.delete(sessionId);
			removed = true;
		}
	});

	if (removed) {
		emitStatus(userId, connection);
	}
};

const normalizeStatus = (status: unknown): SessionStatus | null => {
	if (status === 'online' || status === 2) {
		return 'online';
	}
	if (status === 'idle' || status === 1) {
		return 'idle';
	}
	return null;
};

export const UserPresence = {
	onCleanup(cleanupFunction: CleanupHandler) {
		assertFunction(cleanupFunction, 'UserPresence.onCleanup requires a function as parameter');
		cleanupHandlers.push(cleanupFunction);
	},
	onUserOnline(userOnlineFunction: StatusHandler) {
		assertFunction(userOnlineFunction, 'UserPresence.onUserOnline requires a function as parameter');
		onlineHandlers.push(userOnlineFunction);
	},
	onUserIdle(userIdleFunction: StatusHandler) {
		assertFunction(userIdleFunction, 'UserPresence.onUserIdle requires a function as parameter');
		idleHandlers.push(userIdleFunction);
	},
	onUserOffline(userOfflineFunction: StatusHandler) {
		assertFunction(userOfflineFunction, 'UserPresence.onUserOffline requires a function as parameter');
		offlineHandlers.push(userOfflineFunction);
	},
};

Meteor.onConnection((connection) => {
	connection.onClose(() => removeSession(connection.id, connection));
});

Accounts.onLogin(({ connection, user }) => {
	if (!connection || !user?._id) {
		return;
	}

	setSessionStatus(connection.id, user._id, 'online', connection);
});

Accounts.onLogout(({ connection, user }) => {
	if (connection?.id && user?._id) {
		removeSession(connection.id, connection);
	} else if (user?._id) {
		// Fallback for manual logouts where the connection isn't provided.
		removeAllSessionsForUser(user._id, connection);
	}
});

Meteor.methods({
	updateSessionStatus(status: number | string) {
		const normalized = normalizeStatus(status);
		if (!normalized) {
			throw new Meteor.Error('invalid-status', 'Status must be "online" or "idle"');
		}

		if (!this.userId || !this.connection?.id) {
			return;
		}

		setSessionStatus(this.connection.id, this.userId, normalized, this.connection);
	},
});

Meteor.startup(() => {
	runCleanup();
});
