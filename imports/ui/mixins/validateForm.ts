import Vue, {VueConstructor} from 'vue';
import {ValidationObserver} from 'vee-validate';
import AlertMessage from './../components/Utilities/Alerts/AlertMessage.vue';

export default (Vue as VueConstructor<Vue &
    {
        $alert: InstanceType<typeof AlertMessage>
    }>).extend({
    methods: {
        async isFormValid(observer: InstanceType<typeof ValidationObserver>) {
            const valid = await observer.validate();
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
})
