import { Accounts } from 'meteor/accounts-base';
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import { User } from '../api/Users/user.entity';
import type { UserRequestDto } from '/imports/api/Users/dtos/user-request.dto';

const parseBooleanEnv = (value: string | undefined, defaultValue: boolean): boolean => {
    if (value === undefined) {
        return defaultValue;
    }

    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) {
        return true;
    }
    if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) {
        return false;
    }

    return defaultValue;
};

export class UsersSeeder {
    static seederName = 'users';
    private static factoriesLoaded = false;

    async run(): Promise<void> {
        if (!UsersSeeder.factoriesLoaded) {
            // TODO: move this Factory to a factories folder to be used in seeders and tests. This is to avoid the dynamic import.
            await import('../../tests/server/Factories/Users/UsersFactory.test');
            UsersSeeder.factoriesLoaded = true;
        }

        const requestedCount = Number(process.env.SEED_COUNT ?? 120);
        const count = Number.isFinite(requestedCount) ? Math.max(0, Math.floor(requestedCount)) : 120;
        const shouldClearExisting = parseBooleanEnv(process.env.SEED_CLEAR, true);

        if (shouldClearExisting) {
            const removedCount = await User.collection.removeAsync({ 'profile.seededBy': UsersSeeder.seederName } as any);
            console.info(`[Seed] Removed ${removedCount} previously-seeded users`);
        }

        const createdUserIds: string[] = [];

        for (let index = 0; index < count; index += 1) {
            const templateUser = Factory.tree<UserRequestDto>('simpleUser');
            const uniqueSuffix = `${index}-${Random.id(5)}`.toLowerCase();

            const username = `${templateUser.username}-${uniqueSuffix}`;
            const email = `seed.users.${uniqueSuffix}@example.com`;

            const userId = await Accounts.createUserAsync({
                username,
                email,
                profile: templateUser.profile,
            });

            await User.collection.updateAsync(
                { _id: userId } as any,
                {
                    $set: {
                        'profile.seededBy': UsersSeeder.seederName,
                        'profile.seededAt': new Date(),
                        status: { online: false },
                    },
                },
            );

            createdUserIds.push(userId);
        }

        console.info(`[Seed] Created ${createdUserIds.length} users`);
    }
}
