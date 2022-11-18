<template>
  <div class="login-wrapper">
    <div class="title secondary--text">Welcome!</div>
    <div class="display-1 mb-0 secondary--text">Login</div>
    <Form as="v-form" @submit="login" ref="loginObserver" id="login" autocomplete="off">
      <Field v-slot="{errors}" name="username" rules="required">
        <v-text-field v-model="user.userOrEmail" autocomplete="off" required color="primary"
                      type="text" :error-messages="errors" label="Username"
                      prepend-icon="person">
        </v-text-field>
      </Field>
      <Field v-slot="{errors}" name="password" rules="required" type="password">
        <v-text-field label="Password" type="password" prepend-icon="lock" autocomplete="current-password"
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
    </Form>
  </div>
</template>

<script lang="ts">
import { mapState, mapMutations } from 'vuex';
import validateForm from '/imports/ui/mixins/validateForm';
import { Form, Field, FormContext } from 'vee-validate';
import { defineComponent } from 'vue';
import { Meteor } from 'meteor/meteor';

export default defineComponent({
  mixins: [validateForm],
  name: 'Login',
  components: {
    Form,
    Field
  },
  data() {
    return {
      user: {
        userOrEmail: '',
        password: ''
      },
      error: false
    };
  },
  mounted() {
    this.$refs.loginObserver.resetForm();
  },
  computed: {
    ...mapState('auth', ['errorMessage'])
  },
  methods: {
    ...mapMutations('auth', ['setUser', 'authError']),
    successLogin() {
      Meteor.logoutOtherClients((error: Meteor.Error | any) => {
        if (error) {
          console.error('Error to logout other clients: ', error);
        }
      });
      this.$alert.closeAlert();
      this.setUser(Meteor.user());
      this.$router.push({ name: 'home' });
    },
    async login() {
      console.log('si entro en login');
      if (await this.isFormValid(this.$refs.loginObserver as FormContext)) {
        this.$loader.activate('Logging in. . .');
        Meteor.loginWithPassword(this.user.userOrEmail, this.user.password, (err: Meteor.Error | any) => {
          this.$loader.deactivate();
          if (err) {
            console.error('Error in login: ', err);
            if (err.error === '403') {
              this.$alert.showAlertFull('mdi-close-circle', 'warning', err.reason,
                  '', 5000, 'center', 'bottom');
            } else {
              this.$alert.showAlertFull('mdi-close-circle', 'error', 'Credenciales incorrectas');
            }
            this.authError(err.error);
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
