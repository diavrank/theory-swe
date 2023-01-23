import {
	createRouter, createWebHistory, NavigationGuardNext,
	RouteLocationNormalized
} from 'vue-router';
import routes from '@routes/routes';
import store from './store';
import { Meteor } from 'meteor/meteor';

const router = createRouter({
	history: createWebHistory(),
	routes
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized,
                   next: NavigationGuardNext) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	const isLogged = store.state.auth.isLogged;
	if (!requiresAuth && isLogged && to.path === '/login') {
		next('/');
	} else if (requiresAuth && !isLogged) {
		next('/login');
	} else {
		const userLogged = store.state.auth.user;
		const permission = to.meta?.permission;
		if (permission && userLogged) {
			Meteor.call('checkPermission', {
				userId: userLogged._id,
				permission: permission
			}, (err: Meteor.Error, response: boolean) => {
				if (err) {
					console.error('Error checking permission: ', err);
				} else {
					if (response) {
						next();
					} else {
						router.push({ name: from.name || undefined });
						console.warn('You do not have access to this section.');
					}
				}
			});
		} else {
			next();
		}
	}
});

export default router;
