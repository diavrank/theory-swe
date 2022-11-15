import { defineComponent } from 'vue';
import { FormContext } from 'vee-validate';

export default defineComponent({
	methods: {
		async isFormValid(observer: FormContext) {
			const valid = await observer.validate();
			console.log('valid object: ', valid);
			if (!valid) {
				// @ts-ignore
				this.$alert.showAlertFull('mdi-close-circle',
					'error',
					'Error in the form',
					'',
					5000,
					'right',
					'bottom',
					'Please, complete all required fields with valid values.'
				);
			}
			return valid;
		}
	}
});
