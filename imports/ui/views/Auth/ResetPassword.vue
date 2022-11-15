<template>
  <div>
    <div class="title">Reset password</div>
      <Form as="v-form" @submit.prevent="resetPassword" ref="setPasswordFormObserver">
        <Field v-slot="{errors}" name="new password" vid="confirmation"
                            rules="strength_password|required">
          <v-text-field v-model="user.password" id="inputNewPassword"
                        :type="showPass.new ? 'text' : 'password'"
                        name="password"
                        :error-messages="errors"
                        label="New password"
                        autocomplete="new-password"
                        data-test-id="password-input"
                        required>
            <template v-slot:append>
              <v-btn icon @click="showPass.new = !showPass.new" tabindex="-1">
                <v-icon v-if="!showPass.new">mdi-eye</v-icon>
                <v-icon v-else>mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </Field>
        <Field v-slot="{errors}" name="confirm password" rules="required|confirmed:confirmation">
          <v-text-field v-model="user.confirmPassword" id="inputConfirmPassword"
                        :type="showPass.confirm ? 'text' : 'password'"
                        :error-messages="errors"
                        name="password_confirmation"
                        label="Confirm password"
                        data-test-id="input-password-confirmation"
                        required>
            <template v-slot:append>
              <v-btn icon @click="showPass.confirm = !showPass.confirm" tabindex="-1">
                <v-icon v-if="!showPass.confirm">mdi-eye</v-icon>
                <v-icon v-else>mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </Field>
        <div class="d-flex start mt-2">
          <v-btn type="submit" color="primary" rounded data-test-id="change-button">Change</v-btn>
        </div>
      </Form>

  </div>
</template>

<script lang="ts">
import {Form, Field, FormContext} from 'vee-validate';
import  {defineComponent} from 'vue';
import validateForm from './../../mixins/validateForm';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

export default defineComponent({
  name: 'ResetPassword',
  components: {
    Form,
    Field
  },
  mixins: [validateForm],
  data() {
    return {
      user: {
        password: null,
        confirmPassword: null
      },
      showPass: {
        new: false,
        confirm: false
      }
    };
  },
  methods: {
    async resetPassword() {
      if (await this.isFormValid(this.$refs.setPasswordFormObserver as FormContext)) {
        const token = this.$route.params.token as string;
        Accounts.resetPassword(token, this.user.password || '', (err: Error | Meteor.Error | Meteor.TypedError | undefined) => {
          if (err) {
            console.error('An error occurred while resetting the password', err);
            this.$alert.showAlertSimple('error', 'An error occurred while resetting the password');
          } else {
            this.$alert.showAlertSimple('success', 'Password reset successfully!');
            this.$router.push({name: 'login'});
          }
        });
      }
    }
  }
})
</script>

<style scoped>

</style>
