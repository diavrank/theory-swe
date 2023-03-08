import { FormContext } from 'vee-validate';
// @ts-ignore
import { AlertMessageType } from '@components/Utilities/Alerts/AlertMessage.vue';

export const useFormValidation = async function (observer: FormContext, alert: AlertMessageType) {
    const validation = await observer.validate();
    if (!validation.valid) {
        alert.showAlertFull('cancel',
            'error',
            'Error in the form',
            '',
            5000,
            'bottom right',
            'Please, complete all required fields with valid values.')
    }
    return validation.valid;
};
