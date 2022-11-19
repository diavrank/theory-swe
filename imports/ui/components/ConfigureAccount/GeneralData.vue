<template>
  <Form as="v-form" @submit.prevent="saveUser" ref="dataFormObserver"
        id="saveUser" autocomplete="off">
    <v-card>
      <v-card-title>
        <div class="text-subtitle-2">
          GENERAL DATA
        </div>
      </v-card-title>
      <v-row>
        <v-col cols="12" sm="12" md="3" lg="3" class="pl-10">
          <v-img :src="user.profile.path || '/img/user.png'" :alt="user.profile.name" width="100px"/>
          <v-file-input
              v-show="false"
              ref="imageFile"
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
            <Field v-slot="{ errors }" name="name" rules="required|alpha_spaces">
              <v-text-field v-model="user.profile.name" id="inputName" name="name"
                            :error-messages="errors"
                            label="Full name*" required>
              </v-text-field>
            </Field>
            <Field v-slot="{ errors }" name="username" rules="required|alpha_dash">
              <v-text-field v-model="user.username"
                            id="inputUsername"
                            :error-messages="errors"
                            name="username"
                            label="Username*" required>
              </v-text-field>
            </Field>
            <Field v-slot="{errors}" name="email" rules="required|email">
              <v-text-field v-model="user.emails[0].address"
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
  </Form>
</template>

<script lang="ts">
import profilesMixin from '../../mixins/accounts/profiles';
import {mapMutations} from 'vuex';
import {Form, Field, FormContext} from 'vee-validate';
import validateForm from '/imports/ui/mixins/validateForm';
import {Meteor} from 'meteor/meteor';
import {User} from '../../typings/users'
import uploadImage from '../../mixins/users/uploadImage';
import {defineComponent} from "vue";
import {ResponseMessage} from "/imports/startup/server/utils/ResponseMessage";

export default defineComponent({
  name: 'GeneralData',
  mixins: [validateForm, profilesMixin, uploadImage],
  components: {
    Form,
    Field
  },
  data() {
    return {
      user: {
        emails: [{verified: false}],
        profile: {}
      } as User,
      photoFileUser: null
    };
  },
  created() {
    const user = this.$store.state.auth.user;
    if(user){
      this.user = {
        username: user.username,
        emails: user.emails,
        profile: {
          profile: user.profile.profile,
          name: user.profile.name,
          path: user.profile.path,
        }
      };
    }
  },
  methods: {
    ...mapMutations('auth', ['setUser']),
    async saveUser() {
      if (await this.isFormValid(this.$refs.dataFormObserver as FormContext)) {
        this.$loader.activate('Updating data. . .');
        Meteor.call('user.updatePersonalData', {user: this.user, photoFileUser: this.photoFileUser},
            (err: Meteor.Error, response: ResponseMessage) => {
              this.$loader.deactivate();
              if (err) {
                console.error('Error to save user: ', err);
                this.$alert.showAlertSimple('error', err.reason);
              } else {
                this.setUser(Meteor.user());
                this.emitter.emit('setUserLogged');
                this.$alert.showAlertSimple('success', response.message);
              }
            });
      }
    }
  }
})
</script>

<style scoped>

</style>
