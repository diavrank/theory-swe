import ListUsers from '../views/Users/ListUsers.vue';
import SaveUser from '../views/Users/SaveUser.vue';
import { CreateElement } from 'vue';

export default {
    path: 'usuarios',
    meta: {
        breadcrumb: 'Usuarios',
        permission: 'users-view',
        name: 'home.users'
    },
    components: {
        sectionView: {
            render: (c: CreateElement) => c('router-view')
        }
    },
    children: [
        {
            name: 'home.users',
            path: '',
            meta: {
                permission: 'users-view'
            },
            component: ListUsers
        },
        {
            name: 'home.users.create',
            path: 'crear',
            meta: {
                type: 'create',
                breadcrumb: 'Crear usuario',
                permission: 'users-create'
            },
            component: SaveUser
        },
        {
            name: 'home.users.edit',
            path: 'editar',
            meta: {
                type: 'edit',
                breadcrumb: 'Editar usuario',
                permission: 'users-edit'
            },
            component: SaveUser
        }
    ]
};
