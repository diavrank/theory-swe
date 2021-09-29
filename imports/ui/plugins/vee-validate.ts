import { extend, localize } from 'vee-validate';
import { required, email, min, confirmed, alpha_spaces, alpha_dash } from 'vee-validate/dist/rules';
import validatorEs from 'vee-validate/dist/locale/es.json';

localize('es', validatorEs);
extend('email', email);
extend('required', required);
extend('min', min);
extend('confirmed', confirmed);
extend('alpha_spaces', alpha_spaces);
extend('alpha_dash', alpha_dash);
extend('strength_password', {
	message: field => `Field ${ field } must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number and a special character (e.g.,. _ &? Etc.)`,
	validate: value => {
		const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\_\.\/\?\¡\¿])(?=.{8,})');
		return strongRegex.test(value);
	}
});
