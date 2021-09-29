import ListUsers from '../views/Users/ListUsers.vue';
import SaveUser from '../views/Users/SaveUser.vue';
import { CreateElement } from 'vue';

export default {
    path: 'users',
    meta: {
        breadcrumb: 'Users',
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
            path: 'create',
            meta: {
                type: 'create',
                breadcrumb: 'Create user',
                permission: 'users-create'
            },
            component: SaveUser
        },
        {
            name: 'home.users.edit',
            path: 'edit',
            meta: {
                type: 'edit',
                breadcrumb: 'Edit user',
                permission: 'users-edit'
            },
            component: SaveUser
        }
    ]
};
