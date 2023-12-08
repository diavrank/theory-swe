import Login from '@views/Auth/Login.vue';
import ForgotPassword from '@views/Auth/ForgotPassword.vue';
import ResetPassword from '@views/Auth/ResetPassword.vue';
import LytAuth from '@layouts/LytAuth.vue';
import SetInitialPassword from '@views/Auth/SetInitialPassword.vue';
import VerifyAccount from '@views/Auth/VerifyAccount.vue';

export default {
	path: '/login',
	components: {
		allPageView: LytAuth
	},
	children: [
		{
			path: '',
			name: 'login',
			components: {
				sectionView: Login
			}
		},
		{
			name: 'forgotPassword',
			path: '/forgot-password',
			components: {
				sectionView: ForgotPassword
			}
		},
		{
			name: 'resetPassword',
			path: '/reset-password/:token',
			components: {
				sectionView: ResetPassword
			}
		},
		{
			name: 'verifyEmail',
			path: '/verify-email/:token',
			components: {
				sectionView: VerifyAccount
			}
		},
		{
			name: 'enrollAccount',
			path: '/enroll-account/:token',
			components: {
				sectionView: SetInitialPassword
			}
		}
	]
};
