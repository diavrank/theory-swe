<template>
  <div>
    <div class="title">Set initial password</div>
    <Form as="div" v-slot="{handleSubmit}" ref="setPasswordFormObserver">
      <v-form @submit="handleSubmit($event,setPassword)">
        <Field v-slot="{ field, errors }" name="password" rules="required|strength_password" type="password">
          <v-text-field v-bind="field" v-model="user.password" id="inputNewPassword"
                        :type="showPass.new ? 'text' : 'password'"
                        name="password"
                        :error-messages="errors"
                        label="New password"
                        data-test-id="password-input"
                        autocomplete="new-password">
            <template #append-inner>
              <v-btn icon variant="text" @click="showPass.new = !showPass.new" tabindex="-1">
                <v-icon v-if="!showPass.new">mdi:mdi-eye</v-icon>
                <v-icon v-else>mdi:mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </Field>
        <Field v-slot="{ field, errors }" name="confirm password" rules="required|confirmed:@password">
          <v-text-field v-bind="field" v-model="user.confirmPassword" id="inputConfirmPassword"
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
        <div class="d-flex justify-start mt-2">
          <v-btn type="submit" color="primary" rounded data-test-id="send-button">Send</v-btn>
        </div>
      </v-form>
    </Form>
  </div>
</template>

<script lang="ts">
import { Form, Field, FormContext } from 'vee-validate';
import { defineComponent, inject, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Injections, MeteorError } from '@typings/utilities';
import { AlertMessageType } from '@components/Utilities/Alerts/AlertMessage.vue';
import { useFormValidation } from '/imports/ui/composables/forms';

export default defineComponent({
  name: 'SetInitialPassword',
  components: {
    Form,
    Field
  },
  setup() {
    const setPasswordFormObserver = ref(null);
    const route = useRoute();
    const router = useRouter();
    const alert = inject<AlertMessageType>(Injections.AlertMessage);
    const user = reactive({
      password: null,
      confirmPassword: null
    });
    const showPass = reactive({
      new: false,
      confirm: false
    });

    const setPassword = async () => {
      const observer = setPasswordFormObserver.value as FormContext | null;
      if (observer && alert && await useFormValidation(observer, alert)) {
        const token = route.params.token as string;
        Accounts.resetPassword(token, user.password || '', (error: MeteorError) => {
          if (error) {
            console.error('An error occurred while setting the password', error);
            alert?.showAlertSimple('error', 'An error occurred while resetting the password');
          } else {
            alert?.showAlertSimple('success', 'Password reset successfully');
            router.push({ name: 'login' });
          }
        })
      }
    }

    return { setPasswordFormObserver, user, showPass, setPassword}
  }
});
</script>
