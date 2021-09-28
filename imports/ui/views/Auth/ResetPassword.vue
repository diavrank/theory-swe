<template>
  <div>
    <div class="title">Restablecer contraseña</div>
    <ValidationObserver ref="setPasswordFormObserver">
      <v-form @submit.prevent="resetPassword">
        <ValidationProvider v-slot="{errors}" name="nueva contraseña" vid="confirmation"
                            rules="strength_password|required">
          <v-text-field v-model="user.password" id="inputNewPassword"
                        :type="showPass.new ? 'text' : 'password'"
                        name="password"
                        :error-messages="errors"
                        label="Nueva contraseña"
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
        </ValidationProvider>
        <ValidationProvider v-slot="{errors}" name="confirmar contraseña" rules="required|confirmed:confirmation">
          <v-text-field v-model="user.confirmPassword" id="inputConfirmPassword"
                        :type="showPass.confirm ? 'text' : 'password'"
                        :error-messages="errors"
                        name="password_confirmation"
                        label="Confirmar contraseña"
                        data-test-id="input-password-confirmation"
                        required>
            <template v-slot:append>
              <v-btn icon @click="showPass.confirm = !showPass.confirm" tabindex="-1">
                <v-icon v-if="!showPass.confirm">mdi-eye</v-icon>
                <v-icon v-else>mdi-eye-off</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </ValidationProvider>
        <div class="d-flex start mt-2">
          <v-btn type="submit" color="primary" rounded data-test-id="change-button">Cambiar</v-btn>
        </div>
      </v-form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import {ValidationProvider, ValidationObserver} from 'vee-validate';
import Vue, {VueConstructor} from 'vue';
import validateForm from './../../mixins/validateForm';
import AlertMessage from './../../components/Utilities/Alerts/AlertMessage.vue';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'

export default (Vue as VueConstructor<Vue &
    InstanceType<typeof validateForm> &
    {
      $refs: {
        setPasswordFormObserver: InstanceType<typeof ValidationObserver>
      },
      $alert: InstanceType<typeof AlertMessage>
    }>).extend({
  name: 'ResetPassword',
  components: {
    ValidationObserver,
    ValidationProvider
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
      if (await this.isFormValid(this.$refs.setPasswordFormObserver)) {
        const token = this.$route.params.token;
        Accounts.resetPassword(token, this.user.password || '', (err: Error | Meteor.Error | Meteor.TypedError | undefined) => {
          if (err) {
            console.error('An error occurred while resetting the password', err);
            this.$alert.showAlertSimple('error', 'Se produjo un error al restablecer la contraseña');
          } else {
            this.$alert.showAlertSimple('success', 'Se restableció la contraseña exitosamente!');
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
