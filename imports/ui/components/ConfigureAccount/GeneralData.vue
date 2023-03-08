<template>
  <Form as="div" :initial-values="initialValues" v-slot="{handleSubmit}" ref="dataFormObserver">
    <v-form @submit="handleSubmit($event,saveUser)" id="saveUser" autocomplete="off">
      <v-card>
        <v-card-title>
          <div class="text-subtitle-2">
            GENERAL DATA
          </div>
        </v-card-title>
        <v-row>
          <v-col cols="12" sm="12" md="3" lg="3" class="pl-10">
            <v-img :src="user.profile.path || '/img/user.png'" :alt="user.profile.name" width="100"/>
            <v-file-input
                id="fileUpload"
                v-show="false"
                v-model="file"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Load ..."
                prepend-icon="mdi:mdi-camera"
            ></v-file-input>
            <v-btn color="primary" class="mb-5"
                   rounded depressed @click="onClickUploadButton">
              <span v-if="user.profile.path">Change</span>
              <span v-else>Load</span>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="12" md="9" lg="9">
            <v-card-text>
              <Field v-slot="{ field, errors }" name="name" rules="required|alpha_spaces">
                <v-text-field v-bind="field" v-model="user.profile.name" id="inputName" name="name"
                              :error-messages="errors"
                              label="Full name*" required>
                </v-text-field>
              </Field>
              <Field v-slot="{ field, errors }" name="username" rules="required|alpha_dash">
                <v-text-field v-bind="field" v-model="user.username"
                              id="inputUsername"
                              :error-messages="errors"
                              name="username"
                              label="Username*" required>
                </v-text-field>
              </Field>
              <Field v-slot="{ field, errors }" name="email" rules="required|email">
                <v-text-field v-bind="field" v-model="user.emails[0].address"
                              id="inputEmail" name="email"
                              :error-messages="errors"
                              label="Email*"
                              required>
                </v-text-field>
              </Field>

              <div class="d-flex justify-center">
                <v-btn type="submit" color="primary" rounded depressed>
                  Save
                </v-btn>
              </div>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
  </Form>
</template>

<script lang="ts">
import profilesMixin from '@mixins/accounts/profiles';
import { Form, Field } from 'vee-validate';
import { Meteor } from 'meteor/meteor';
import { User } from '@typings/users';
import { defineComponent, inject, reactive, ref } from 'vue';
import { ResponseMessage } from '@server/utils/ResponseMessage';
import { useAuthStore } from '/imports/ui/stores/auth';
import { useFormValidation } from '/imports/ui/composables/forms';
import { Injections, MeteorError } from '@typings/utilities';
import { AlertMessageType } from '@components/Utilities/Alerts/AlertMessage.vue';
import { LoaderType } from '@components/Utilities/Loaders/Loader.vue';
import { useUploadImage } from '/imports/ui/composables/users/uploadImage';

export default defineComponent({
  name: 'GeneralData',
  mixins: [profilesMixin],
  components: {
    Form,
    Field
  },
  setup(_props, context) {
    const authStore = useAuthStore();
    const dataFormObserver = ref(null);
    const alert = inject<AlertMessageType>(Injections.AlertMessage);
    const loader = inject<LoaderType>(Injections.Loader);
    const user: User = reactive(authStore.user ? {...authStore.user} : {
      emails: [{ verified: false}],
      profile: {}
    });
    const initialValues = reactive({
      name: authStore.user?.profile.name || '',
      username: authStore.user?.username || '',
      email: authStore.user?.emails[0].address || ''
    })
    const photoFileUser = ref(null);
    const {file, onClickUploadButton} = useUploadImage('fileUpload', (ev) => {
      user.profile.path = ev.target.result;
      photoFileUser.value = ev.target.result;
    })

    const saveUser = async () => {
      if (await useFormValidation(dataFormObserver.value, alert)) {
        loader?.activate('Updating data . . .');
        Meteor.call('user.updatePersonalData', { user, photoFileUser: photoFileUser.value },
            (error: MeteorError, response: ResponseMessage) => {
          loader?.deactivate();
          if (error) {
            console.error('Error to save user: ', error);
            alert?.showAlertSimple('error', error.reason);
          } else {
            authStore.setUser(Meteor.user());
            context.emit('setUserLogged');
            alert?.showAlertSimple('success', response.message);
          }
        })
      }
    };

    return {
      authStore,
      dataFormObserver,
      saveUser,
      initialValues,
      photoFileUser,
      user,
      file,
      onClickUploadButton
    };
  }
});
</script>
