<template>
  <Form as="div" v-slot="{handleSubmit}" ref="passwordFormObserver">
    <v-form @submit="handleSubmit($event,updatePassword)" id="updatePassword" autocomplete="off">
      <v-card>
        <v-card-title>
          <div class="text-subtitle-2">
            CHANGE PASSWORD
          </div>
        </v-card-title>

        <v-card-text>
          <Field v-slot="{ field, errors }" name="current password" rules="required">
            <v-text-field v-bind="field" v-model="password.old" id="inputPassword"
                          :append-icon="showPass.old ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
                          :type="showPass.old ? 'text' : 'password'"
                          name="current_password"
                          label="Current password"
                          @click:append="showPass.old = !showPass.old"
                          autocomplete="off"
                          :error-messages="errors">
            </v-text-field>
          </Field>
          <Field v-slot="{ field, errors }" name="password" type="password"
                 rules="required|min:8|strength_password">
            <v-text-field v-bind="field" v-model="password.new" id="inputNewPassword"
                          :append-icon="showPass.new ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
                          :type="showPass.new ? 'text' : 'password'"
                          name="password"
                          label="New password"
                          @click:append="showPass.new = !showPass.new"
                          autocomplete="new-password"
                          :error-messages="errors">
            </v-text-field>
          </Field>
          <Field v-slot="{ field, errors }" name="password confirmation"
                 rules="required|confirmed:@password">
            <v-text-field v-bind="field" v-model="password.confirm" id="inputConfirmPassword"
                          :append-icon="showPass.confirm ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
                          :type="showPass.confirm ? 'text' : 'password'"
                          name="password_confirmation"
                          label="Confirm password"
                          @click:append="showPass.confirm = !showPass.confirm"
                          :error-messages="errors">
            </v-text-field>
          </Field>
        <div class="d-flex justify-center">
          <v-btn type="submit" color="primary" rounded depressed>Change</v-btn>
        </div>
        </v-card-text>
      </v-card>
    </v-form>
  </Form>

</template>

<script lang="ts">
import JsonHelper from '@mixins/helpers/json';
import validateForm from '@mixins/validateForm';
import { Form, Field, FormContext } from 'vee-validate';
import { defineComponent, inject, reactive, ref } from 'vue';
import { AlertMessageType } from '@components/Utilities/Alerts/AlertMessage.vue';
import { Injections, MeteorError } from '@typings/utilities';
import { useFormValidation } from '/imports/ui/composables/forms';
import { useNullifyObject } from '/imports/ui/composables/helpers/json';

interface PasswordInput {
  old: string | null;
  new: string | null;
  confirm: string | null;
}

export default defineComponent({
  name: 'UpdatePassword',
  components: {
    Form,
    Field
  },
  mixins: [validateForm, JsonHelper],
  setup() {
    const passwordFormObserver = ref(null);
    const alert = inject<AlertMessageType>(Injections.AlertMessage);
    const password: PasswordInput = reactive({
      old: null,
      new: null,
      confirm: null
    });
    const showPass = reactive({
      old: false,
      new: false,
      confirm: false
    });

    const updatePassword = async () => {
      const observer = passwordFormObserver.value as FormContext | null;
      if (observer && alert && await useFormValidation(observer, alert)) {
        Accounts.changePassword(password.old || '', password.new || '',
            async (error: MeteorError) => {
          useNullifyObject(password);
          observer.resetForm();
          if (error) {
            console.error('Error changing password: ', error);
            alert?.showAlertSimple('error', 'An error occurred while changing the password.');
            document.getElementById('inputPassword')?.focus();
          } else {
            alert?.showAlertSimple('success', 'Password has been updated!');
          }
        })
      }
    };

    return { password, showPass, passwordFormObserver, updatePassword };
  }
});
</script>
