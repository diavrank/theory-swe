const INSTALL_FLAG = '__mongoMonitorGuardInstalled__';
const KNOWN_ERROR_NAME = 'PoolClearedOnNetworkError';
const KNOWN_ERROR_TEXT = 'server monitor timeout';

const getErrorText = (error: unknown): string => {
	if (error instanceof Error) return `${error.name}: ${error.message}`;
	if (typeof error === 'string') return error;
	return String(error);
};

const isKnownMongoMonitorTimeout = (error: unknown): boolean => {
	const text = getErrorText(error);
	return text.includes(KNOWN_ERROR_NAME) && text.includes(KNOWN_ERROR_TEXT);
};

const handleFatalError = (origin: string, error: unknown) => {
	if (isKnownMongoMonitorTimeout(error)) {
		console.error(
			`[MongoMonitorGuard] Ignored transient Mongo monitor timeout from ${origin}. Meteor will keep running.`
		);
		return;
	}

	console.error(`[MongoMonitorGuard] Fatal ${origin}`, error);
	process.exit(1);
};

const globalScope = globalThis as typeof globalThis & {
	[INSTALL_FLAG]?: boolean;
};

if (!globalScope[INSTALL_FLAG]) {
	globalScope[INSTALL_FLAG] = true;

	process.on('uncaughtException', (error) => {
		handleFatalError('uncaughtException', error);
	});

	process.on('unhandledRejection', (reason) => {
		handleFatalError('unhandledRejection', reason);
	});
}
