<template>
  <v-container>
    <v-row justify="center">
      <v-col class="d-flex" xs="12" sm="9" md="8" lg="6" xl="4">
        <v-btn variant="text" exact @click="$router.back()">
          <v-icon>mdi:mdi-chevron-left</v-icon>
        </v-btn>
        <div class="text-h5 font-weight-light">{{ dataView.title }}</div>
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
          <Form as="div" v-slot="{handleSubmit}" :initial-values="initialValues" ref="userFormObserver">
            <v-form @submit="handleSubmit($event,saveUser)" id="saveUser" autocomplete="off">
              <v-row>
                <v-col sm="4" md="4">
                  <div class="d-flex flex-column align-center">
                    <v-img :src="user.profile.path || '/img/user.png'" :alt="user.profile.name" width="100"/>
                    <v-file-input
                        id="fileUpload"
                        v-show="false"
                        v-model="file"
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="Load ..."
                        prepend-icon="mdi:mdi-camera"
                    ></v-file-input>

                    <v-btn color="primary" class="mb-5 mt-5"
                           width="100%"
                           rounded depressed @click="onClickUploadButton">
                      <span v-if="user.profile.path">Change</span>
                      <span v-else>Load</span>
                    </v-btn>
                  </div>
                </v-col>
                <v-col sm="8" md="8">
                  <Field type="text" name="name" v-slot="{ field, errors }" rules="required">
                    <v-text-field v-bind="field" label="Full name" v-model="user.profile.name"
                                  :error-messages="errors">
                    </v-text-field>
                  </Field>
                  <Field name="profile" v-slot="{ field, errors }" rules="required">
                    <v-select v-bind="field" v-model="user.profile.profile" :items="profiles" id="selectProfile"
                              item-title="description" item-value="name"
                              :error-messages="errors"
                              label="Profile"
                              required></v-select>
                  </Field>
                  <Field name="username" v-slot="{ field, errors }" rules="required">
                    <v-text-field v-bind="field" v-model="user.username"
                                  id="inputUsername"
                                  :error-messages="errors"
                                  label="Username" required>
                    </v-text-field>
                  </Field>
                  <Field name="email" v-slot="{ field, errors }" rules="required|email">
                    <v-text-field v-bind="field" v-model="user.emails[0].address"
                                  id="inputEmail"
                                  :error-messages="errors"
                                  label="Email"
                                  required></v-text-field>
                  </Field>
                </v-col>
              </v-row>
            </v-form>
          </Form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Field, Form, FormContext } from 'vee-validate';
import { ProfileCollection } from '@api/Profiles/ProfileCollection';
import validateForm from '@mixins/validateForm';
import { ResponseMessage } from '@server/utils/ResponseMessage';
import { Meteor } from 'meteor/meteor';
import { LOADER_MESSAGES } from '/imports/ui/constants/loader-messages.const';
import uploadImage from '@mixins/users/uploadImage';
import { defineComponent } from 'vue';
import { useTemporalStore } from '/imports/ui/stores/temporal';

export default defineComponent({
  name: 'SaveUser',
  mixins: [validateForm, uploadImage],
  components: {
    Form,
    Field
  },
  setup() {
    const temporalStore = useTemporalStore();
    return { temporalStore };
  },
  data() {
    return {
      dataView: {
        title: '',
        targetButton: ''
      },
      user: {
        emails: [{ verified: false }],
        profile: {}
      } as Meteor.User,
      initialValues: {
        name: '',
        profile: '',
        username: '',
        email: ''
      }
    };
  },
  mounted() {
    if (this.$route.meta.type === 'create') {
      this.dataView.title = 'Create user';
      this.dataView.targetButton = 'Create';
    } else if (this.$route.meta.type === 'edit') {
      this.dataView.title = 'Edit user';
      this.dataView.targetButton = 'Update';
      const tempUser = this.temporalStore.element;
      if (tempUser) {
        this.user = {
          _id: tempUser._id,
          username: tempUser.username,
          emails: tempUser.emails,
          profile: {
            profile: tempUser.profile.profile,
            name: tempUser.profile.name,
            path: tempUser.profile.path
          }
        };
        this.initialValues = {
          name: tempUser.profile.name,
          profile: tempUser.profile.profile,
          username: tempUser.username,
          email: tempUser.emails[0].address
        };
      } else {
        this.$router.push({ name: 'home.users' });
      }
    }
  },
  methods: {
    async saveUser() {
      if (await this.isFormValid(this.$refs.userFormObserver as FormContext)) {
        this.$loader.activate(LOADER_MESSAGES.SAVE_USER);
        //TODO: Refresh this.user with values from
        Meteor.call('user.save', { user: this.user, photoFileUser: this.photoFileUser },
            (error: Meteor.Error, response: ResponseMessage) => {
              this.$loader.deactivate();
              if (error) {
                console.error(error);
                this.$alert.showAlertSimple('error', error.reason);
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
      return ProfileCollection.find({}).fetch();
    }
  }
});
</script>

<style scoped lang="sass">
.section
  padding: 25px
  background-color: white
  border-radius: 10px
</style>
