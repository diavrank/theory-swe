import Permissions from '../../Permissions/helpers/permissions.helpers';

export interface SystemOptionType {
    icon: string;
    title: string;
    description: string | null;
    permission: string;
    namePath: string;
    divider?: boolean;
}

export const systemOptions: SystemOptionType[] = [
    {
        icon: 'mdi:mdi-account-group',
        title: 'Users',
        description: null,
        permission: Permissions.USERS.LIST.VALUE,
        namePath: 'home.users',
    },
    {
        icon: 'mdi:mdi-account-key',
        title: 'Profiles',
        description: null,
        permission: Permissions.PROFILES.LIST.VALUE,
        namePath: 'home.profiles',
    },
    {
        icon: 'mdi:mdi-draw',
        title: 'Digital Signature',
        description: null,
        permission: Permissions.DIGITAL_SIGNATURE.VIEW.VALUE,
        namePath: 'home.digitalSignature',
    },
];
