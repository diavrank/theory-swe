import { defineRule } from 'vee-validate';
import { required, email, min, confirmed, alpha_spaces, alpha_dash } from '@vee-validate/rules';

defineRule('email', email);
defineRule('required', required);
defineRule('min', min);
defineRule('confirmed', confirmed);
defineRule('alpha_spaces', alpha_spaces);
defineRule('alpha_dash', alpha_dash);
defineRule('strength_password', (value: string, _params, ctx) => {
	const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\_\.\/\?\¡\¿])(?=.{8,})');
	if (!strongRegex.test(value)) {
		return `Field ${ ctx.field } must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number and a special character (e.g.,. _ &? Etc.)`;
	}
	return true;
});