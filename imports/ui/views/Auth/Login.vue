<template>
  <div class="login-wrapper">
    <div class="title secondary--text">Bienvenido!</div>
    <div class="display-1 mb-0 secondary--text">Iniciar sesión</div>
    <ValidationObserver ref="loginObserver">
      <v-form @submit.prevent="login" autocomplete="nope">
        <ValidationProvider v-slot="{errors}" name=" " rules="required">
          <v-text-field id="inputUser" v-model="user.userOrEmail" autocomplete="off" required color="primary"
                        type="text" :error-messages="errors" label="Usuario" name="email"
                        prepend-icon="person" data-test-id="input-user">
          </v-text-field>
        </ValidationProvider>
        <ValidationProvider v-slot="{errors}" name="contraseña" rules="required">
          <v-text-field id="inputPassword" label="Contraseña" name="password" prepend-icon="lock"
                        :error-messages="errors" v-model="user.password" required type="password"
                        data-test-id="input-password">
          </v-text-field>
        </ValidationProvider>
        <div class="d-flex justify-end">
          <v-btn color="primary" tabindex="-1" text :to="{name:'forgotPassword'}" small>
            ¿Olvidé mi contraseña?
          </v-btn>
        </div>
        <div class="d-flex justify-start">
          <v-btn type="submit" rounded color="primary" transition="fade" data-test-id="login-button">Entrar</v-btn>
        </div>
      </v-form>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import {mapState, mapMutations} from 'vuex';
import validateForm from './../../mixins/validateForm';
import {ValidationProvider, ValidationObserver} from 'vee-validate';
import Vue, {VueConstructor} from 'vue';
import AlertMessage from './../../components/Utilities/Alerts/AlertMessage.vue';
import { Meteor } from 'meteor/meteor';

export default (Vue as VueConstructor<Vue &
    InstanceType<typeof validateForm> &
    {
      $refs: {
        loginObserver: InstanceType<typeof ValidationObserver>
      },
      $alert: InstanceType<typeof AlertMessage>
    }>).extend({
  mixins: [validateForm],
  name: 'Login',
  components: {
    ValidationProvider,
    ValidationObserver
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
  async mounted() {
    await this.$refs.loginObserver.reset();
  },
  computed: {
    ...mapState('auth', ['errorMessage'])
  },
  methods: {
    ...mapMutations('auth', ['setUser', 'authError']),
    successLogin() {
      Meteor.logoutOtherClients((error: Meteor.Error | any) => {
        if (error) {
          console.error('Error al cerrar sesión en otros clientes: ', error);
        }
      });
      this.$alert.closeAlert();
      this.setUser(Meteor.user());
      this.$router.push({name: 'home'});
    },
    async login() {
      if (await this.isFormValid(this.$refs.loginObserver)) {
        Meteor.loginWithPassword(this.user.userOrEmail, this.user.password, (err: Meteor.Error | any) => {
          if (err) {
            console.error('Error in login: ', err);
            if(err.error === '403'){
              this.$alert.showAlertFull('mdi-close-circle', 'warning', err.reason,
                  '', 5000, 'center', 'bottom');
            }else{
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
})
</script>

<style scoped>
.login-wrapper {
  margin-top: 45px;
}
</style>
