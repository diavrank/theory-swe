import { Meteor } from 'meteor/meteor';
import { RefreshPermissionsBackfill } from './recurring/RefreshPermissionsBackfill';
import { RefreshStaticProfilesBackfill } from './recurring/RefreshStaticProfilesBackfill';

type BackfillConstructor = {
    backfillName: string;
    new(): { run: () => Promise<void> };
};

const registeredBackfills: Record<string, BackfillConstructor> = {
    [RefreshPermissionsBackfill.backfillName]: RefreshPermissionsBackfill,
    [RefreshStaticProfilesBackfill.backfillName]: RefreshStaticProfilesBackfill,
};

const getRequestedBackfills = (): { names: string[]; exitAfterRun: boolean } => {
    const requested = new Set<string>();
    const backfillFromEnv = process.env.BACKFILL;

    if (backfillFromEnv) {
        requested.add(backfillFromEnv);
    }

    return { names: Array.from(requested), exitAfterRun: Boolean(backfillFromEnv) };
};

const runBackfillByName = async (name: string): Promise<void> => {
    const BackfillClass = registeredBackfills[name];

    if (!BackfillClass) {
        const available = Object.keys(registeredBackfills).join(', ');
        throw new Error(`Backfill "${name}" not found. Available backfills: ${available || 'none'}.`);
    }

    const backfill = new BackfillClass();

    console.info(`[Backfill] Starting ${name}`);
    await backfill.run();
    console.info(`[Backfill] Completed ${name}`);
};

const runBackfillsIfRequested = async (): Promise<void> => {
    const { names, exitAfterRun } = getRequestedBackfills();

    if (!names.length) {
        return;
    }

    const exitBackfillProcess = (code: number): void => {
        delete process.env.BACKFILL;

        // Ensure we also stop the Meteor tool wrapper (parent) so the command exits cleanly.
        try {
            if (process.ppid) {
                process.kill(process.ppid, 'SIGTERM');
            }
        } catch (killError) {
            console.warn('[Backfill] Unable to terminate parent process:', killError);
        }

        process.exit(code);
    };

    try {
        for (const name of names) {
            // Run sequentially to avoid unexpected write races.
            await runBackfillByName(name);
        }

        if (exitAfterRun) {
            exitBackfillProcess(0);
        }
    } catch (error) {
        console.error('[Backfill] Failed to run requested backfill(s):', error);

        if (exitAfterRun) {
            exitBackfillProcess(1);
        }

        throw error;
    }
};

export const initBackfills = (): void => {
    Meteor.startup(() => {
        void runBackfillsIfRequested();
    });
};
