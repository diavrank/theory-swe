import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { NpmModuleMongodb } from 'meteor/npm-mongo';
import process from 'node:process';

type SessionStatus = 1 | 2; // 1 = idle, 2 = online
type CleanupHandler = (sessionIds?: string[]) => void;
type StatusHandler = (userId: string, connection?: Meteor.Connection) => void;

interface PresenceServerDoc {
	_id: string;
	createdAt: Date;
	lastPing: Date;
	watcher?: boolean;
	graceful?: boolean;
}

interface UserSessionDoc {
	_id: string;
	serverId: string;
	userId: string;
	status: SessionStatus;
}

const Servers = new Mongo.Collection<PresenceServerDoc>('presence:servers');
const UserSessions = new Mongo.Collection<UserSessionDoc>('presence:user-sessions');

const cleanupHandlers: CleanupHandler[] = [];
const onlineHandlers: StatusHandler[] = [];
const idleHandlers: StatusHandler[] = [];
const offlineHandlers: StatusHandler[] = [];
const userStates = new Map<string, 'online' | 'idle' | 'offline'>();

let serverId: string | null = null;
let isWatcher = false;
let observeHandle: Meteor.LiveQueryHandle | null = null;
let exitGracefully = true;
let heartbeatHandle: ReturnType<typeof Meteor.setInterval> | null = null;

const assertFunction = (fn: unknown, message: string) => {
	if (typeof fn !== 'function') {
		throw new Meteor.Error('not-a-function', message);
	}
};

const createIndex = async (collection: Mongo.Collection<any>, index: NpmModuleMongodb.IndexSpecification, options?: NpmModuleMongodb.CreateIndexesOptions) => {
	if ((collection as any).createIndexAsync) {
		return (collection as any).createIndexAsync(index, options);
	}
	// TODO: Remove the below methods since are not compatible in Server side.
	if ((collection as any).createIndex) {
		return (collection as any).createIndex(index, options);
	}
	return (collection as any)._ensureIndex(index, options);
};

const tryCreateIndexes = async () => {
	try {
		await createIndex(Servers, { lastPing: 1 }, { expireAfterSeconds: 10 });
		await createIndex(Servers, { createdAt: -1 });
		await createIndex(UserSessions, { userId: 1 });
		await createIndex(UserSessions, { serverId: 1 });
		await createIndex(UserSessions, { status: 1 });
	} catch (e) {
		Meteor._debug('Failed to create indexes for presence collections', e);
	}
};

const runCleanupHandlers = (sessionIds?: string[]) => {
	cleanupHandlers.forEach((handler) => handler(sessionIds));
};

const normalizeStatus = (status: unknown): SessionStatus | null => {
	if (status === 'online' || status === 2) {
		return 2;
	}
	if (status === 'idle' || status === 1) {
		return 1;
	}
	return null;
};

const emitStatus = async (userId: string, connection?: Meteor.Connection) => {
	const sessions = await UserSessions.find({ userId }, { fields: { status: 1 } }).fetchAsync();
	const next = sessions.length === 0
		? 'offline'
		: sessions.some((session) => session.status === 2) ? 'online' : 'idle';

	const previous = userStates.get(userId) ?? 'offline';
	if (previous === next) {
		return;
	}

	userStates.set(userId, next);

	if (next === 'online') {
		onlineHandlers.forEach((handler) => handler(userId, connection));
	} else if (next === 'idle') {
		idleHandlers.forEach((handler) => handler(userId, connection));
	} else {
		offlineHandlers.forEach((handler) => handler(userId, connection));
	}
};

const ensureServerId = async () => {
	if (!serverId) {
		await insertServer();
	}
	return serverId as string;
};

const setSessionStatus = async (sessionId: string, userId: string, status: SessionStatus, connection?: Meteor.Connection) => {
	const resolvedServerId = await ensureServerId();
	await UserSessions.upsertAsync(sessionId, {
		$set: {
			serverId: resolvedServerId,
			userId,
			status,
		},
	});
	await emitStatus(userId, connection);
};

const removeSession = async (sessionId: string, connection?: Meteor.Connection) => {
	const session = await UserSessions.findOneAsync({ _id: sessionId }, { fields: { userId: 1 } });
	if (!session) {
		return;
	}
	await UserSessions.removeAsync(sessionId);
	await emitStatus(session.userId, connection);
};

const removeAllSessionsForUser = async (userId: string, connection?: Meteor.Connection) => {
	const sessions = await UserSessions.find({ userId }, { fields: { _id: 1 } }).fetchAsync();
	if (sessions.length === 0) {
		return;
	}
	await UserSessions.removeAsync({ userId });
	await emitStatus(userId, connection);
};

const cleanupServerSessions = async (removedServerId?: string) => {
	if (removedServerId) {
		const staleSessions = await UserSessions.find({ serverId: removedServerId }, { fields: { _id: 1, userId: 1 } }).fetchAsync();
		const sessionIds: string[] = [];
		const affectedUsers = new Set<string>();

		for (const session of staleSessions) {
			sessionIds.push(session._id);
			affectedUsers.add(session.userId);
		}

		if (sessionIds.length > 0) {
			await UserSessions.removeAsync({ serverId: removedServerId });
			for (const userId of affectedUsers) {
				await emitStatus(userId);
			}
		}

		runCleanupHandlers(sessionIds);
	} else {
		await UserSessions.removeAsync({});
		userStates.clear();
		runCleanupHandlers();
	}
};

const setAsWatcher = async () => {
	if (serverId) {
		isWatcher = true;
		await Servers.updateAsync(serverId, { $set: { watcher: true } });
	}
};

const updateWatcher = async () => {
	const latest = await Servers.findOneAsync({}, { sort: { createdAt: -1 } });
	if (latest?._id === serverId) {
		await setAsWatcher();
	}
};

const observeServers = () => {
	observeHandle = Servers.find().observe({
		removed(document) {
			if (document._id === serverId) {
				if (!isWatcher) {
					Meteor._debug('Server Presence Timeout', 'Presence watcher detected stale state, shutting down.');
					exitGracefully = false;
					process.kill(process.pid, 'SIGHUP');
				} else {
					void cleanupServerSessions(document._id);
					// watcher lost its own doc, reinsert to continue watching
					void insertServer();
				}
			} else if (isWatcher) {
				if (!document.graceful) {
					void cleanupServerSessions(document._id);
				}
			} else if (document.watcher) {
				if (!document.graceful) {
					void cleanupServerSessions(document._id);
				}
				updateWatcher();
			}
		},
	});
};

const insertServer = async () => {
	const now = new Date();
	serverId = await Servers.insertAsync({ createdAt: now, lastPing: now });
	if (isWatcher) {
		await setAsWatcher();
	}
};

const startServerPresence = async () => {
	await tryCreateIndexes();
	observeServers();

	heartbeatHandle = Meteor.setInterval(async () => {
		if (serverId) {
			await Servers.updateAsync(serverId, { $set: { lastPing: new Date() } });
		}
	}, 5000);

	await insertServer();

	const watcherExists = await Servers.findOneAsync({ watcher: true });
	if (!watcherExists) {
		await setAsWatcher();
		// full cleanup to ensure fresh state
		await cleanupServerSessions();
	}
};

const stopServerPresence = Meteor.bindEnvironment(async () => {
	if (exitGracefully && serverId) {
		await Servers.updateAsync(serverId, { $set: { graceful: true } });
	}
	observeHandle?.stop?.();
	if (heartbeatHandle) {
		Meteor.clearInterval(heartbeatHandle);
	}
	if (serverId) {
		await cleanupServerSessions(serverId);
	}
});

['SIGINT', 'SIGHUP', 'SIGTERM'].forEach((sig) => {
	process.once(sig, () => {
		stopServerPresence();
		process.kill(process.pid, sig);
	});
});

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
	connection.onClose(() => {
		void removeSession(connection.id, connection);
	});
});

Accounts.onLogin(({ connection, user }) => {
	if (!connection || !user?._id) {
		return;
	}
	void setSessionStatus(connection.id, user._id, 2, connection);
});

Accounts.onLogout(({ connection, user }) => {
	if (connection?.id && user?._id) {
		void removeSession(connection.id, connection);
	} else if (user?._id) {
		// Fallback for manual logouts where the connection isn't provided.
		void removeAllSessionsForUser(user._id, connection);
	}
});

Meteor.methods({
	async updateSessionStatus(this: Meteor.MethodThisType, status: number | string) {
		const normalized = normalizeStatus(status);
		if (!normalized) {
			throw new Meteor.Error('invalid-status', 'Status must be "online" or "idle"');
		}

		if (!this.userId || !this.connection?.id) {
			return;
		}

		await setSessionStatus(this.connection.id, this.userId, normalized, this.connection);
	},
});

Meteor.startup(() => {
	startServerPresence();
});
