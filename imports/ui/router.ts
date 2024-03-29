import {
	createRouter, createWebHistory, NavigationGuardNext,
	RouteLocationNormalized
} from 'vue-router';
import routes from '@routes/routes';
import { Meteor } from 'meteor/meteor';
import { AuthStoreType, useAuthStore } from '/imports/ui/stores/auth';

const router = createRouter({
	history: createWebHistory(),
	// @ts-ignore
	routes
});

const verifyPermission = (authStore: AuthStoreType, to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
	const userLogged = authStore.user;
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

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized,
                   next: NavigationGuardNext) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	const authStore = useAuthStore();
	const isLogged = authStore.isLogged;
	if (!requiresAuth && isLogged && to.path === '/login') {
		next('/');
	} else if (requiresAuth && !isLogged) {
		next('/login');
	} else {
		verifyPermission(authStore, to, from, next);
	}
});

export default router;
