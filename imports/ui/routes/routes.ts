import loginRoutes from '/imports/ui/routes/loginRoutes';
import userRoutes from '/imports/ui/routes/usersRoutes';
import profileRoutes from './profilesRoutes';
import LytSPA from '../layouts/LytSPA.vue';
import ConfigureAccount from '../views/Account/ConfigureAccount.vue';
import Home from '../views/Home/Home.vue';

export default [
	{
		path: '*',
		redirect: '/login'
	},
	loginRoutes,
	{
		path: '/',
		components: {
			allPageView: LytSPA
		},
		meta: {
			requiresAuth: true,
			breadcrumb: 'Home',
			name: 'home'
		},
		children: [
			{
				path: '',
				name: 'home',
				components: {
					sectionView: Home
				}
			},
			{
				path: 'account',
				name: 'home.account',
				meta: {
					breadcrumb: 'Configure account'
				},
				components: {
					sectionView: ConfigureAccount
				}
			},
			userRoutes,
			profileRoutes
		]
	}
];
