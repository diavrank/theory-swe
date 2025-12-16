import { permissionsArray, readOnlyPermissions } from "../../Permissions/helpers/permissions.helpers";

export interface StaticProfileType {
    name: string;
    description: string;
    permissions: string[];
    external: boolean;
}

export interface StaticProfilesType {
    [key: string]: StaticProfileType;
}

export const StaticProfiles: StaticProfilesType = {
    admin: {
        name: 'admin',
        description: 'Administrator',
        permissions: permissionsArray.map((p) => p.VALUE),
        external: false,
    },
    readOnly: {
        name: 'read-only',
        description: 'Read Only',
        permissions: readOnlyPermissions,
        external: false,
    }
};