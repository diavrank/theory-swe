import Permissions from '../../startup/server/Permissions';

/**
 * Arreglo de opciones del sistema
 * @type {*[]}
 */
export interface SystemOptionType {
  icon: string;
  title: string;
  description: string | null;
  permission: string;
  namePath: string;
}

const systemOptions: SystemOptionType[] = [
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

/**
 * Verifica si un permiso se encuentra dentro del conjunto de perfiles
 * @param permission Permiso a evualuar
 * @param roles Conjunto de perfiles de permisos
 * @returns {boolean} true si el permiso se encuentra en alguno de los perfiles / false de lo contrario
 */
const verifyPermission = function (permission: string, roles: string[]) {
  if (!roles) {
    console.error('Roles value is not valid', roles);
    return false;
  }
  return !!roles.find((role) => role === permission);
};

/**
 * Obtiene las opciones del sistema permitidas a un usuario
 * @param roles Perfiles/Permisos de un usuario
 * @returns {Array}
 */
const getSystemOptionsByUserRoles = function (
  roles: string[],
): SystemOptionType[] {
  const optionsForUser: SystemOptionType[] = [];
  if (roles) {
    systemOptions.forEach((option) => {
      if (option.permission) {
        const hasPermission = verifyPermission(option.permission, roles);
        if (hasPermission) {
          optionsForUser.push(option);
        }
      } else {
        optionsForUser.push(option);
      }
    });
  }
  return optionsForUser;
};

const getAllSystemOptions = () => systemOptions;

export default { getSystemOptionsByUserRoles, getAllSystemOptions };
