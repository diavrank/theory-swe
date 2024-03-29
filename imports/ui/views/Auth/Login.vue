<template>
  <div class="login-wrapper">
    <div class="title secondary--text">Welcome!</div>
    <div class="display-1 mb-0 secondary--text">Login</div>
    <Form as="div" :initial-values="initialValues" v-slot="{handleSubmit}" ref="loginObserver">
      <v-form @submit="handleSubmit($event,login)" autocomplete="off">
        <Field v-slot="{ field, errors }" name="username" rules="required">
          <v-text-field v-bind="field" name="username" v-model="user.userOrEmail" autocomplete="off" required color="primary"
                        type="text" :error-messages="errors" label="Username"
                        prepend-icon="person">
          </v-text-field>
        </Field>
        <Field v-slot="{ field, errors }" name="password" rules="required">
          <v-text-field v-bind="field" name="password" label="Password" type="password" prepend-icon="lock" autocomplete="current-password"
                        :error-messages="errors" v-model="user.password" required>
          </v-text-field>
        </Field>
        <div class="d-flex justify-end">
          <v-btn color="primary" tabindex="-1" variant="text" :to="{name:'forgotPassword'}" size="small">
            Forgot password?
          </v-btn>
        </div>
        <div class="d-flex justify-start">
          <v-btn type="submit" rounded color="primary" transition="fade">Enter</v-btn>
        </div>
      </v-form>
    </Form>
  </div>
</template>

<script lang="ts">
import validateForm from '@mixins/validateForm';
import { Form, Field, FormContext } from 'vee-validate';
import { defineComponent } from 'vue';
import { Meteor } from 'meteor/meteor';
import { useAuthStore } from '/imports/ui/stores/auth';

export default defineComponent({
  name: 'Login',
  mixins: [validateForm],
  components: {
    Form,
    Field
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      user: {
        userOrEmail: 'admin',
        password: 'Theory_5w3'
      },
      error: false,
      initialValues:{username:'admin',password:'Theory_5w3'}
    };
  },
  mounted() {
    this.$refs.loginObserver.resetForm();
  },
  methods: {
    successLogin() {
      Meteor.logoutOtherClients((error: Meteor.Error | any) => {
        if (error) {
          console.error('Error to logout other clients: ', error);
        }
      });
      this.$alert.closeAlert();
      this.authStore.setUser(Meteor.user());
      this.$router.push({ name: 'home' });
    },
    async login() {
      if (await this.isFormValid(this.$refs.loginObserver as FormContext)) {
        this.$loader.activate('Logging in. . .');
        Meteor.loginWithPassword(this.user.userOrEmail, this.user.password, (err: Meteor.Error | any) => {
          this.$loader.deactivate();
          if (err) {
            console.error('Error in login: ', err);
            if (err.error === '403') {
              this.$alert.showAlertFull('mdi:mdi-close-circle', 'warning', err.reason,
                  '', 5000,  'bottom');
            } else {
              this.$alert.showAlertFull('mdi:mdi-close-circle', 'error', 'Incorrect credentials');
            }
            this.authStore.authError(err.error);
            this.error = true;
          } else {
            this.successLogin();
          }
        });
      }
    }
  }
});
</script>

<style scoped>
.login-wrapper {
  margin-top: 45px;
}
</style>
