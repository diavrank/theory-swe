import { defineComponent } from 'vue';
import { FormContext } from 'vee-validate';

export default defineComponent({
	methods: {
		async isFormValid(observer: FormContext) {
			const validation = await observer.validate();
			if (!validation.valid) {
				// @ts-ignore
				this.$alert.showAlertFull('cancel',
					'error',
					'Error in the form',
					'',
					5000,
					'bottom right',
					'Please, complete all required fields with valid values.'
				);
			}
			return validation.valid;
		}
	}
});
