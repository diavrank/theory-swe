import ListProfiles from '@views/Profiles/ListProfiles.vue';
import SaveProfile from '@views/Profiles/SaveProfile.vue';
import { h, resolveComponent } from 'vue';

export default {
    path: 'profiles',
    meta: {
        breadcrumb: 'Profiles',
        name: 'home.profiles',
        permission: 'profiles-view'
    },
    components: {
        sectionView: {
            render: () => h(resolveComponent('router-view'))
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
            path: 'create',
            meta: {
                type: 'create',
                breadcrumb: 'Create profile',
                permission: 'profiles-create'
            },
            component: SaveProfile
        },
        {
            name: 'home.profiles.edit',
            path: 'edit',
            meta: {
                type: 'edit',
                breadcrumb: 'Edit profile',
                permission: 'profiles-edit'
            },
            component: SaveProfile
        }
    ]
};
