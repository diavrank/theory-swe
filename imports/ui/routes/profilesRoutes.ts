import ListProfiles from '../views/Profiles/ListProfiles.vue';
import SaveProfile from '../views/Profiles/SaveProfile.vue';
import { CreateElement } from 'vue';

export default {
    path: 'perfiles',
    meta: {
        breadcrumb: 'Perfiles',
        name: 'home.profiles',
        permission: 'profiles-view'
    },
    components: {
        sectionView: {
            render: (c: CreateElement) => c('router-view')
        }
    },
    children: [
        {
            name: 'home.profiles',
            path: '',
            meta: {
                permission: 'profiles-view'
            },
            component: ListProfiles
        },
        {
            name: 'home.profiles.create',
            path: 'crear',
            meta: {
                type: 'create',
                breadcrumb: 'Crear perfil',
                permission: 'profiles-create'
            },
            component: SaveProfile
        },
        {
            name: 'home.profiles.edit',
            path: 'editar',
            meta: {
                type: 'edit',
                breadcrumb: 'Editar perfil',
                permission: 'profiles-edit'
            },
            component: SaveProfile
        }
    ]
};
