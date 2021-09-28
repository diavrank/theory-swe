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
                    'Error en el formulario',
                    '',
                    5000,
                    'right',
                    'bottom',
                    'Por favor complete todos los campos obligatorios con valores válidos.'
                );
            }
            return valid;
        }
    }
})
