<template>
  <div class="title">Set initial password</div>
  <Form as="v-form" @submit.prevent="setPassword"
        ref="setPasswordFormObserver">
    <Field v-slot="{errors}" name="new password"
                        rules="required|min:8|strength_password"
                        vid="password">
      <v-text-field v-model="user.password" id="inputNewPassword"
                    :type="showPass.new ? 'text' : 'password'"
                    name="password"
                    :error-messages="errors"
                    label="New password"
                    data-test-id="password-input"
                    @click:append="showPass.new = !showPass.new"
                    :append-icon="!showPass.new ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
                    autocomplete="new-password"></v-text-field>
    </Field>
    <Field v-slot="{errors}" name="confirm password" rules="required|confirmed:password">
      <v-text-field v-model="user.confirmPassword" id="inputConfirmPassword"
                    :type="showPass.confirm ? 'text' : 'password'"
                    :error-messages="errors"
                    name="password_confirmation"
                    label="Confirm password"
                    data-test-id="input-password-confirmation"
                    @click:append="showPass.confirm = !showPass.confirm"
                    :append-icon="!showPass.confirm ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
                    required></v-text-field>
    </Field>
    <div class="d-flex justify-start mt-2">
      <v-btn type="submit" color="primary" rounded data-test-id="send-button">Send</v-btn>
    </div>
  </Form>
</template>

<script lang="ts">
import { Form, Field, FormContext} from 'vee-validate';
import  {defineComponent} from 'vue';
import validateForm from './../../mixins/validateForm';
import {Meteor} from 'meteor/meteor';

export default defineComponent({
  name: 'SetInitialPassword',
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
    async setPassword() {
      if (await this.isFormValid(this.$refs.setPasswordFormObserver as FormContext)) {
        const token = <string>this.$route.params.token;
        Accounts.resetPassword(token, this.user.password || '', (err: Error | Meteor.Error | Meteor.TypedError | undefined) => {
          if (err) {
            console.error('An error occurred while setting the password\n', err);
            this.$alert.showAlertSimple('error', 'An error occurred while setting the password');
          } else {
            this.$alert.showAlertSimple('success', 'Password set successfully!');
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
