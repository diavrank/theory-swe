<template>
  <div class="login-wrapper">
    <div class="title secondary--text">Welcome!</div>
    <div class="display-1 mb-0 secondary--text">Login</div>
    <Form as="div" v-slot="{handleSubmit}" @invalid-submit="login" :initial-values="initialValues" ref="loginObserver">
      <v-form @submit.prevent="handleSubmit($event, login)" autocomplete="off">
        <Field v-slot="{ field, errors }" name="username" rules="required">
          <v-text-field v-bind="field" name="username" v-model="user.userOrEmail" autocomplete="off" required
                        color="primary"
                        type="text" :error-messages="errors" label="Username"
                        data-test-id="input-user"
                        prepend-icon="person">
          </v-text-field>
        </Field>
        <Field v-slot="{ field, errors }" name="password" rules="required">
          <v-text-field v-bind="field" name="password" label="Password" type="password" prepend-icon="lock"
                        autocomplete="current-password"
                        :error-messages="errors" v-model="user.password" required data-test-id="input-password">
          </v-text-field>
        </Field>
        <div class="d-flex justify-end">
          <v-btn color="primary" tabindex="-1" variant="text" :to="{name:'forgotPassword'}" size="small">
            Forgot password?
          </v-btn>
        </div>
        <div class="d-flex justify-start">
          <v-btn type="submit" rounded color="primary" transition="fade" data-test-id="login-button">Enter</v-btn>
        </div>
      </v-form>
    </Form>
  </div>
</template>

<script lang="ts">
import { Form, Field, FormContext } from 'vee-validate';
import { defineComponent, inject, onMounted, reactive, ref } from 'vue';
import { Meteor } from 'meteor/meteor';
import { useAuthStore } from '/imports/ui/stores/auth';
import { User } from '@typings/users';
import { useRouter } from 'vue-router';
import { useFormValidation } from '/imports/ui/composables/forms';
import { Injections, MeteorError } from '@typings/utilities';
import { AlertMessageType } from '@components/Utilities/Alerts/AlertMessage.vue';
import { LoaderType } from '@components/Utilities/Loaders/Loader.vue';

export default defineComponent({
  name: 'Login',
  components: {
    Form,
    Field
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const alert = inject<AlertMessageType>(Injections.AlertMessage);
    const loader = inject<LoaderType>(Injections.Loader);
    const loginObserver = ref<FormContext | null>(null);
    const error = ref(false);
    const user = reactive({
      userOrEmail: 'admin',
      password: 'Theory_5w3'
    });
    const initialValues = reactive({
      username: 'admin',
      password: 'Theory_5w3'
    })

    const successLogin = () => {
      Meteor.logoutOtherClients((errorResponse: MeteorError) => {
        if (errorResponse) {
          console.error('Error to logout other clients: ', errorResponse);
        }
      });
      alert?.closeAlert();
      authStore.setUser(Meteor.user() as User);
      router.push({name: 'home'});
    }

    const login = async () => {
      const observer = loginObserver.value as FormContext | null;
      if (observer !== null && alert && await useFormValidation(observer, alert)) {
        loader?.activate('Logging in . . .');
        Meteor.loginWithPassword(user.userOrEmail, user.password, (errorResponse: MeteorError) => {
          loader?.deactivate();
          if (errorResponse && errorResponse instanceof Meteor.Error) {
            console.error('Error in login: ', errorResponse);
            if (errorResponse.error === '403') {
              alert?.showAlertFull('mdi:mdi-close-circle', 'warning', errorResponse.reason || '', '', 5000, 'bottom');
            } else {
              alert?.showAlertFull('mdi:mdi-close-circle', 'error', 'Incorrect credentials', '', 5000, 'bottom');
            }
            authStore.authError(+errorResponse.error);
            error.value = true;
          } else {
            successLogin();
          }
        })
      }
    }

    onMounted(() => {
      loginObserver.value?.resetForm();
    });

    return {authStore, loginObserver, user, initialValues, login};
  }
});
</script>

<style scoped>
.login-wrapper {
  margin-top: 45px;
}
</style>
