<template>
  <div>
    <div class="d-flex flex-row justify-start align-baseline">
      <v-btn size="x-small" color="primary" icon :to="{name:'login'}">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <div class="title ml-3">Forgot my password</div>
    </div>
    <Form as="div" v-slot="{handleSubmit}" ref="forgotPasswordObserver" class="mt-3">
      <v-form @submit="handleSubmit($event,forgotPassword)">
        <Field v-slot="{field,errors}" name="email" rules="email|required">
          <v-text-field v-model="user.email" v-bind="field"
                        id="inputEmail" name="email"
                        :error-messages="errors"
                        label="Email*"
                        data-test-id="input-email"
                        required>
          </v-text-field>
        </Field>
        <v-btn type="submit" class="mt-2" color="primary" rounded data-test-id="recover-button">Recover</v-btn>
      </v-form>
    </Form>
  </div>
</template>

<script lang="ts">
import { Field, Form, FormContext } from 'vee-validate';
import { defineComponent, inject, reactive, ref } from 'vue';
import { useFormValidation } from '/imports/ui/composables/forms';
import { Injections, MeteorError } from '@typings/utilities';
import { AlertMessageType } from '@components/Utilities/Alerts/AlertMessage.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ForgotPassword',
  components: {
    Field,
    Form
  },
  setup() {
    const forgotPasswordObserver = ref<FormContext | null>(null);
    const alert = inject<AlertMessageType>(Injections.AlertMessage);
    const router = useRouter();
    const user = reactive({
      email: undefined
    });

    const forgotPassword = async () => {
      const observer = forgotPasswordObserver.value as FormContext | null;
      if (observer && alert && await useFormValidation(observer, alert)) {
        Accounts.forgotPassword(user, (error: MeteorError) => {
          if (error) {
            console.error('Error sending email', error);
            alert?.showAlertSimple('error', 'An error occurred while sending email');
          } else {
            alert?.showAlertSimple('success', 'Email sent! Please open your email and click on the message link that we sent');
            setTimeout(() => {
              router.push({ name: 'login' });
            }, 5000);
          }
        })
      }
    };

    return { user, forgotPassword, forgotPasswordObserver };
  }
});
</script>

