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
import { defineComponent } from 'vue';
import { Meteor } from 'meteor/meteor';

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
  data() {
    return {
      password: {
        old: null,
        new: null,
        confirm: null
      } as PasswordInput,
      showPass: {
        old: false,
        new: false,
        confirm: false
      }
    };
  },
  methods: {
    async updatePassword() {
      if (await this.isFormValid(this.$refs.passwordFormObserver as FormContext)) {
        Accounts.changePassword(this.password.old || '', this.password.new || '',
            async(error: Error | Meteor.Error | Meteor.TypedError | undefined) => {
              this.setNulls(this.password);
              this.$refs.passwordFormObserver.resetForm();
              if (error) {
                console.error('Error changing password: ', error);
                this.$alert.showAlertSimple('error', 'An error occurred while changing the password.');
                document.getElementById('inputPassword').focus();
              } else {
                this.$alert.showAlertSimple('success', 'Password has been updated!');
              }
            });
      }
    }
  }
});
</script>

<style scoped>

</style>
