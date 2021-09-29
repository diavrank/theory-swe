<template>
  <ValidationObserver ref="passwordFormObserver">
    <form @submit.prevent="updatePassword" ref="updatePasswordForm" data-vv-scope="update-password-form">
      <v-card>
        <v-card-title>
          <div class="text-subtitle-2">
            CHANGE PASSWORD
          </div>
        </v-card-title>

        <v-card-text>
          <ValidationProvider v-slot="{errors}" name="current password" rules="required">
            <v-text-field v-model="password.old" id="inputPassword"
                          :append-icon="showPass.old ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPass.old ? 'text' : 'password'"
                          name="current_password"
                          label="Current password"
                          @click:append="showPass.old = !showPass.old"
                          autocomplete="off"
                          :error-messages="errors">
            </v-text-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{errors}" name="new password"
                              rules="required|min:8|strength_password"
                              vid="password">
            <v-text-field v-model="password.new" id="inputNewPassword"
                          :append-icon="showPass.new ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPass.new ? 'text' : 'password'"
                          name="password"
                          label="New password"
                          @click:append="showPass.new = !showPass.new"
                          autocomplete="new-password"
                          :error-messages="errors">
            </v-text-field>
          </ValidationProvider>
          <ValidationProvider v-slot="{errors}" name="confirm password"
                              rules="required|confirmed:password">
            <v-text-field v-model="password.confirm" id="inputConfirmPassword"
                          :append-icon="showPass.confirm ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPass.confirm ? 'text' : 'password'"
                          name="password_confirmation"
                          label="Confirm password"
                          @click:append="showPass.confirm = !showPass.confirm"
                          :error-messages="errors">
            </v-text-field>
          </ValidationProvider>
        </v-card-text>

        <v-card-actions>
          <v-row justify="center">
            <v-btn type="submit" color="primary" rounded depressed>Change</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import JsonHelper from '/imports/ui/mixins/helpers/json';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import Vue, { VueConstructor } from 'vue';
import validateForm from '/imports/ui/mixins/validateForm';
import AlertMessage from './../../components/Utilities/Alerts/AlertMessage.vue';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

interface PasswordInput {
  old: string | null;
  new: string | null;
  confirm: string | null;
}

export default (Vue as VueConstructor<Vue &
    InstanceType<typeof validateForm> &
    InstanceType<typeof JsonHelper> &
    {
      $refs: {
        passwordFormObserver: InstanceType<typeof ValidationObserver>
      },
      $alert: InstanceType<typeof AlertMessage>
    }
    >).extend({
  name: 'UpdatePassword',
  components: {
    ValidationProvider,
    ValidationObserver
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
      if (await this.isFormValid(this.$refs.passwordFormObserver)) {
        Accounts.changePassword(this.password.old || '', this.password.new || '', async (error:  Error | Meteor.Error | Meteor.TypedError | undefined) => {
          this.setNulls(this.password);
          await this.$refs.passwordFormObserver.reset();
          if (error) {
            console.error('Error changing password: ', error);
            this.$alert.showAlertSimple('error', 'An error occurred while changing the password.');
            $('#inputPassword').focus();
          } else {
            this.$alert.showAlertSimple('success', 'Password has been updated!');
          }
        });
      }
    }
  }

})
</script>

<style scoped>

</style>
