import { Meteor } from 'meteor/meteor';
import { UsersSeeder } from './users.seeder';

type SeederConstructor = {
    seederName: string;
    new(): { run: () => Promise<void> };
};

const registeredSeeders: Record<string, SeederConstructor> = {
    [UsersSeeder.seederName]: UsersSeeder,
};

const getRequestedSeeders = (): { names: string[]; exitAfterRun: boolean } => {
    const requested = new Set<string>();
    const seederFromEnv = process.env.SEED;

    if (seederFromEnv) {
        requested.add(seederFromEnv);
    }

    return { names: Array.from(requested), exitAfterRun: Boolean(seederFromEnv) };
};

const runSeederByName = async (name: string): Promise<void> => {
    const SeederClass = registeredSeeders[name];

    if (!SeederClass) {
        const available = Object.keys(registeredSeeders).join(', ');
        throw new Error(`Seeder "${name}" not found. Available seeders: ${available || 'none'}.`);
    }

    const seeder = new SeederClass();

    console.info(`[Seed] Starting ${name}`);
    await seeder.run();
    console.info(`[Seed] Completed ${name}`);
};

const runSeedersIfRequested = async (): Promise<void> => {
    const { names, exitAfterRun } = getRequestedSeeders();

    if (!names.length) {
        return;
    }

    const exitSeedProcess = (code: number): void => {
        delete process.env.SEED;

        try {
            if (process.ppid) {
                process.kill(process.ppid, 'SIGTERM');
            }
        } catch (killError) {
            console.warn('[Seed] Unable to terminate parent process:', killError);
        }

        process.exit(code);
    };

    try {
        for (const name of names) {
            await runSeederByName(name);
        }

        if (exitAfterRun) {
            exitSeedProcess(0);
        }
    } catch (error) {
        console.error('[Seed] Failed to run requested seed(s):', error);

        if (exitAfterRun) {
            exitSeedProcess(1);
        }

        throw error;
    }
};

export const initSeeders = (): void => {
    Meteor.startup(() => {
        void runSeedersIfRequested();
    });
};

