<template>
  <v-container>
    <v-row justify="center">
      <v-col class="d-flex" xs="12" sm="9" md="8" lg="6" xl="4">
        <v-btn text exact @click="$router.back()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div class="display-1 font-weight-light">{{ dataView.title }}</div>
      </v-col>
      <v-col xs="12" sm="2" md="2" lg="2" xl="1">
        <v-btn block type="submit" form="saveUser" color="primary"
               v-text="dataView.targetButton" tabindex="4">
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xs="12" sm="12" md="10" lg="8" xl="5">
        <div class="section elevation-1">
          <ValidationObserver ref="userFormObserver" v-slot="{validation, reset}">
            <v-form @submit.prevent="saveUser" id="saveUser" autocomplete="off">
              <v-row>
                <v-col sm="4" md="4">
                  <div class="d-flex flex-column align-center">
                    <img :src="user.profile.path || '/img/user.png'" :alt="user.profile.name" width="100px">
                    <v-file-input
                        v-show="false"
                        ref="imageFile"
                        v-model="file"
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="Cargar ..."
                        prepend-icon="mdi-camera"
                    ></v-file-input>
                    <v-btn color="primary" class="mb-5 mt-5"
                           width="100%"
                           rounded depressed @click="onClickUploadButton">
                      <span v-if="user.profile.path">Cambiar</span>
                      <span v-else>Cargar</span>
                    </v-btn>
                  </div>
                </v-col>
                <v-col sm="8" md="8">
                  <ValidationProvider v-slot="{ errors }" name="nombre" rules="required">
                    <v-text-field v-model="user.profile.name" id="inputName"
                                  name="name"
                                  :error-messages="errors" label="Nombre completo" required>
                    </v-text-field>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="perfil" rules="required">
                    <v-select v-model="user.profile.profile" :items="profiles" id="selectProfile"
                              item-text="description" item-value="name"
                              :error-messages="errors"
                              label="Perfil"
                              required></v-select>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="usuario" rules="required">
                    <v-text-field v-model="user.username"
                                  id="inputUsername"
                                  :error-messages="errors"
                                  name="username"
                                  label="Usuario" required>
                    </v-text-field>
                  </ValidationProvider>
                  <ValidationProvider v-slot="{ errors }" name="correo electrónico"
                                      rules="required|email">
                    <v-text-field v-model="user.emails[0].address"
                                  id="inputEmail"
                                  :error-messages="errors"
                                  name="email"
                                  label="Correo electrónico"
                                  required>
                    </v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </v-form>
          </ValidationObserver>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { Profile } from '../../../api/Profiles/Profile';
import Vue, { VueConstructor } from 'vue';
import validateForm from '/imports/ui/mixins/validateForm';
import AlertMessage from './../../components/Utilities/Alerts/AlertMessage.vue';
import Loader from './../../components/Utilities/Loaders/Loader.vue';
import { ResponseMessage } from '/imports/startup/server/utils/ResponseMessage';
import { Meteor } from 'meteor/meteor';
import { LOADER_MESSAGES } from "/imports/ui/constants/loader-messages.const";
import uploadImage from '/imports/ui/mixins/users/uploadImage';

export default (Vue as VueConstructor<Vue &
    InstanceType<typeof validateForm> &
    {
      $alert: InstanceType<typeof AlertMessage>,
      $loader: InstanceType<typeof Loader>,
      $refs: {
        userFormObserver: InstanceType<typeof ValidationObserver>
      }
    }
    >).extend({
  name: 'SaveUser',
  mixins: [validateForm,uploadImage],
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    dataView: {
      title: '',
      targetButton: ''
    },
    user: {
      emails: [{ verified: false }],
      profile: {}
    } as Meteor.User,
    photoFileUser: null
  }),
  mounted() {
    if (this.$route.meta.type === 'create') {
      this.dataView.title = 'Crear usuario';
      this.dataView.targetButton = 'Crear';
    } else if (this.$route.meta.type === 'edit') {
      this.dataView.title = 'Editar usuario';
      this.dataView.targetButton = 'Actualizar';
      const tempUser = this.$store.state.temporal.element;
      if (tempUser) {
        this.user = {
          _id: tempUser._id,
          username: tempUser.username,
          emails: tempUser.emails,
          profile: {
            profile: tempUser.profile.profile,
            name: tempUser.profile.name,
            path: tempUser.profile.path
          },
        };
      } else {
        this.$router.push({ name: 'home.users' });
      }
    }
  },
  methods: {
    async saveUser() {
      if (await this.isFormValid(this.$refs.userFormObserver)) {
        this.$loader.activate(LOADER_MESSAGES.SAVE_PROFILE);
        Meteor.call('user.save', { user: this.user, photoFileUser: this.photoFileUser },
            (err: Meteor.Error, response: ResponseMessage) => {
              this.$loader.deactivate();
              if (err) {
                console.log('error: ', err);
                this.$alert.showAlertSimple('error', err.reason);
              } else {
                this.$alert.showAlertSimple('success', response.message);
                this.$router.push({ name: 'home.users' });
              }
            });
      }
    }
  },
  meteor: {
    $subscribe: {
      'allProfiles': []
    },
    profiles() {
      return Profile.find({}).fetch();
    }
  }
})
</script>

<style scoped lang="sass">
.section
  padding: 25px
  background-color: white
  border-radius: 10px
</style>
