<template>
  <ValidationObserver ref="dataFormObserver">
    <v-form @submit.prevent="saveUser">
      <v-card>
        <v-card-title>
          <div class="text-subtitle-2">
            DATOS GENERALES
          </div>
        </v-card-title>
        <v-row>
          <v-col cols="12" sm="12" md="3" lg="3" class="pl-10">
            <img :src="user.profile.path || '/img/user.png'" :alt="user.profile.name" width="100px">
            <v-file-input
                v-show="false"
                ref="imageFile"
                v-model="file"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Cargar ..."
                prepend-icon="mdi-camera"
            ></v-file-input>
            <v-btn color="primary" class="mb-5"
                   rounded depressed @click="onClickUploadButton">
              <span v-if="user.profile.path">Cambiar</span>
              <span v-else>Cargar</span>
            </v-btn>
          </v-col>
          <v-col cols="12" sm="12" md="9" lg="9">
            <v-card-text>
              <ValidationProvider v-slot="{ errors }" name="nombre" rules="required|alpha_spaces">
                <v-text-field v-model="user.profile.name" id="inputName" name="name"
                              :error-messages="errors"
                              label="Nombre completo*" required>
                </v-text-field>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="usuario" rules="required|alpha_dash">
                <v-text-field v-model="user.username"
                              id="inputUsername"
                              :error-messages="errors"
                              name="username"
                              label="Usuario*" required>
                </v-text-field>
              </ValidationProvider>
              <ValidationProvider v-slot="{errors}" name="correo electrónico" rules="required|email">
                <v-text-field v-model="user.emails[0].address"
                              id="inputEmail" name="email"
                              :error-messages="errors"
                              label="Correo electrónico*"
                              required>
                </v-text-field>
              </ValidationProvider>

              <div class="d-flex justify-center">
                <v-btn type="submit" color="primary" rounded depressed>
                  Guardar
                </v-btn>
              </div>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
  </ValidationObserver>
</template>

<script lang="ts">
import profilesMixin from '../../mixins/accounts/profiles';
import { mapMutations } from 'vuex';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import Vue, { VueConstructor } from 'vue';
import validateForm from '/imports/ui/mixins/validateForm';
import AlertMessage from './../../components/Utilities/Alerts/AlertMessage.vue';
import Loader from './../../components/Utilities/Loaders/Loader.vue';
import { Meteor } from 'meteor/meteor';
import { User } from '../../typings/users'
import uploadImage from '../../mixins/users/uploadImage';

export default (Vue as VueConstructor<Vue &
    InstanceType<typeof validateForm> &
    {
      $refs: {
        dataFormObserver: InstanceType<typeof ValidationObserver>
      },
      $alert: InstanceType<typeof AlertMessage>,
      $loader: InstanceType<typeof Loader>,
      photoFileUser: any
    }
    >).extend({
  name: 'GeneralData',
  mixins: [validateForm, profilesMixin,uploadImage],
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      user: {
        emails: [{ verified: false }],
        profile: {}
      } as User,
      photoFileUser: null
    };
  },
  created() {
    const user: User = this.$store.state.auth.user;
    this.user = {
      _id: user._id,
      username: user.username,
      emails: user.emails,
      profile:{
        profile: user.profile.profile,
        name: user.profile.name,
        path: user.profile.path,
      }
    };
  },
  methods: {
    ...mapMutations('auth', ['setUser']),
    async saveUser() {
      if (await this.isFormValid(this.$refs.dataFormObserver)) {
        this.$loader.activate('Actualizando datos');
        Meteor.call('user.updatePersonalData', { user: this.user, photoFileUser: this.photoFileUser },
            (err: Meteor.Error,response) => {
              this.$loader.deactivate();
              if (err) {
                console.error('Error to save user: ', err);
                this.$alert.showAlertSimple('error', err.reason);
              } else {
                this.setUser(Meteor.user());
                this.$root.$emit('setUserLogged');
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
