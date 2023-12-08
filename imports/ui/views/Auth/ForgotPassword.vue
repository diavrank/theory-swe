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
import validateForm from '@mixins/validateForm';
import { Field, Form, FormContext } from 'vee-validate';
import { defineComponent } from 'vue';
import { Meteor } from 'meteor/meteor';

export default defineComponent({
  name: 'ForgotPassword',
  mixins: [validateForm],
  components: {
    Field,
    Form
  },
  data() {
    return {
      user: {
        email: undefined
      }
    };
  },
  methods: {
    async forgotPassword() {
      if (await this.isFormValid(this.$refs.forgotPasswordObserver as FormContext)) {
        Accounts.forgotPassword(this.user, (err: Meteor.Error | any) => {
          if (err) {
            console.error('Error sending email', err);
            this.$alert.showAlertSimple('error', 'An error occurred while sending email.');
          } else {
            this.$alert.showAlertSimple('success',
                'Email sent! Please open your email and click on the message link that we sent.');
            setTimeout(() => {
              this.$router.push({ name: 'login' });
            }, 5000);
          }
        });

      }
    }
  }
});
</script>

<style scoped>

</style>
