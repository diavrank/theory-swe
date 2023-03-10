<template>
  <div>
    <div class="title">Reset password</div>
    <Form as="v-form" ref="setPasswordFormObserver">
      <v-form @submit.prevent="resetPassword" autocomplete="off">
        <Field v-slot="{field, errors}" name="password" rules="strength_password|required">
          <v-text-field v-bind="field"
                        v-model="user.password" id="inputNewPassword"
                        :type="showPass.new ? 'text' : 'password'"
                        name="password"
                        :error-messages="errors"
                        label="New password"
                        autocomplete="new-password"
                        data-test-id="password-input"
                        required>
            <template #append-inner>
              <v-btn icon variant="text" @click="showPass.new = !showPass.new" tabindex="-1">
                <v-icon v-if="!showPass.new">mdi:mdi-eye</v-icon>
                <v-icon v-else>mdi:mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </Field>
        <Field v-slot="{field, errors}" name="confirm password" rules="required|confirmed:@password">
          <v-text-field v-model="user.confirmPassword" id="inputConfirmPassword"
                        v-bind="field"
                        :type="showPass.confirm ? 'text' : 'password'"
                        :error-messages="errors"
                        name="password_confirmation"
                        label="Confirm password"
                        data-test-id="input-password-confirmation"
                        required>
            <template #append-inner>
              <v-btn icon variant="text" @click="showPass.confirm = !showPass.confirm" tabindex="-1">
                <v-icon v-if="!showPass.confirm">mdi:mdi-eye</v-icon>
                <v-icon v-else>mdi:mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </Field>
        <div class="d-flex start mt-2">
          <v-btn type="submit" color="primary" rounded data-test-id="change-button">Change</v-btn>
        </div>
      </v-form>
    </Form>

  </div>
</template>

<script lang="ts">
import { Form, Field, FormContext } from 'vee-validate';
import { defineComponent, inject, reactive, ref } from 'vue';
import { useFormValidation } from '/imports/ui/composables/forms';
import { Injections, MeteorError } from '@typings/utilities';
import { AlertMessageType } from '@components/Utilities/Alerts/AlertMessage.vue';
import { useRoute, useRouter } from 'vue-router';
import { LoaderType } from '@components/Utilities/Loaders/Loader.vue';
import { Accounts } from 'meteor/accounts-base';

export default defineComponent({
  name: 'ResetPassword',
  components: {
    Form,
    Field
  },
  setup() {
    const setPasswordFormObserver = ref(null);
    const route = useRoute();
    const router = useRouter();
    const alert = inject<AlertMessageType>(Injections.AlertMessage);
    const loader = inject<LoaderType>(Injections.Loader);
    const user = reactive({
      password: null,
      confirmPassword: null
    });
    const showPass = reactive({
      new: false,
      confirm: false
    });
    const resetPassword = async () => {
      const observer = setPasswordFormObserver.value as FormContext | null;
      if (observer && alert && await useFormValidation(observer, alert)) {
        const token = route.params.token as string;
        loader?.activate('Resetting password . . .');
        Accounts.resetPassword(token, user.password || '', (error: MeteorError) => {
          loader?.deactivate();
          if (error) {
            console.error('An error occurred while resetting the password', error);
            alert?.showAlertSimple('error', 'An error occurred while resetting the password');
          } else {
            alert?.showAlertSimple('success', 'Password reset successfully');
            router.push({name: 'login'});
          }
        })
      }
    };

    return {setPasswordFormObserver, user, showPass, resetPassword};
  }
})
</script>

