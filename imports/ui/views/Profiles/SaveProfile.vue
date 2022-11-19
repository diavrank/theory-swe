<template>
  <v-container>
    <v-row justify="center">
      <v-col class="d-flex" xs="12" sm="9" md="8" lg="6" xl="4">
        <v-btn variant="text" exact @click="$router.back()">
          <v-icon>mdi:mdi-chevron-left</v-icon>
        </v-btn>
        <div class="display-1 font-weight-light">{{ dataView.title }}</div>
      </v-col>
      <v-col xs="12" sm="2" md="2" lg="2" xl="1">
        <v-btn block type="submit" form="saveProfile" color="primary"
               v-text="dataView.targetButton" tabindex="4">
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xs="12" sm="12" md="10" lg="8" xl="5">
        <div class="section elevation-1">
          <Form as="v-form" @submit.prevent="saveProfile" ref="profileObserver"
                id="saveProfile" autocomplete="off">
            <v-row>
              <v-col md="6">
                <Field v-slot="{errors}" name="name" rules="required">
                  <v-text-field v-model="profile.name" id="inputName" name="name"
                                :error-messages="errors"
                                label="Profile's name" required>
                  </v-text-field>
                </Field>
              </v-col>
              <v-col md="6">
                <Field v-slot="{errors}" name="description" rules="required">
                  <v-text-field v-model="profile.description"
                                :error-messages="errors"
                                id="inputDescriptionProfile" name="descriptionProfile"
                                label="Profile's description" required>
                  </v-text-field>
                </Field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div>
                  <p class="title font-weight-regular">Permissions of this profile</p>
                  <v-card-text>
                    <v-text-field v-model="searchSelfPermission" placeholder="Buscar. . ."
                                  id="inputSearchSelfPermission" name="descriptionProfile">
                    </v-text-field>
                  </v-card-text>
                  <v-sheet
                      id="scrolling-techniques-2"
                      class="overflow-y-auto"
                      max-height="500">
                    <v-list style="height: 400px;">
                        <draggable :list="filteredSelfPermissions"
                                   @change="(ev) => onChangeDragList(ev, 'selfPermissions')"
                                   item-key="_id"
                                   group="permissions">
                          <template #item="{element: permission}">
                            <v-list-item v-text="permission.publicName"></v-list-item>
                          </template>
                        </draggable>
                    </v-list>
                  </v-sheet>
                </div>
              </v-col>
              <v-col>
                <div>
                  <p class="title font-weight-regular">All permissions</p>
                  <v-card-text>
                    <v-text-field v-model="searchPermission" placeholder="Buscar. . ."
                                  id="inputSearchPermission" name="inputSearchPermission">
                    </v-text-field>
                  </v-card-text>
                  <v-sheet
                      id="scrolling-techniques-3"
                      class="overflow-y-auto"
                      max-height="500">
                    <v-list style="height: 400px;">
                      <draggable class="list-item-group" :list="filteredPermissions"
                                 @change="(ev) => onChangeDragList(ev, 'allPermissions')"
                                 item-key="_id"
                                 group="permissions">
                        <template #item="{element: permission}">
                          <v-list-item v-text="permission.publicName"></v-list-item>
                        </template>
                      </draggable>
                    </v-list>
                  </v-sheet>
                </div>
              </v-col>
            </v-row>
          </Form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import {Field, Form, FormContext} from 'vee-validate';
import validateForm from '/imports/ui/mixins/validateForm';
import {defineComponent} from 'vue';
import {Meteor} from 'meteor/meteor';
import {ResponseMessage} from '/imports/startup/server/utils/ResponseMessage';
import {RoleType} from '/imports/api/Permissions/Permission';
import {LOADER_MESSAGES} from '/imports/ui/constants/loader-messages.const';
import {VueDraggableEvents} from '../../typings/utilities';

enum PermissionGroup {
  Self = 'selfPermissions',
  All = 'allPermissions'
}

export default defineComponent({
  name: 'SaveProfile',
  components: {
    draggable,
    Form,
    Field
  },
  mixins: [validateForm],
  data: () => ({
    dataView: {
      title: '',
      targetButton: ''
    },
    profile: {
      _id: undefined,
      name: null,
      description: null,
      permissions: [] as string[]
    },
    searchSelfPermission: '',
    searchPermission: '',
    selfPermissions: [] as RoleType[],
    allPermissions: [] as RoleType[]
  }),
  mounted() {
    if (this.$route.meta.type === 'create') {
      this.dataView.title = 'Create profile';
      this.dataView.targetButton = 'Create';
      this.listAllPermissions();
    } else if (this.$route.meta.type === 'edit') {
      this.dataView.title = 'Edit profile';
      this.dataView.targetButton = 'Update';
      if (this.$store.state.temporal.element) {
        this.profile = {...this.$store.state.temporal.element};
        this.initPermissionLists();
      } else {
        this.$router.push({name: 'home.profiles'});
      }
    }
  },
  computed: {
    filteredSelfPermissions() {
      return this.selfPermissions.filter(permission => {
        return permission.publicName.toLowerCase().includes(this.searchSelfPermission.toLowerCase());
      });
    },
    filteredPermissions() {
      return this.allPermissions.filter(permission => {
        return permission['publicName'].toLowerCase().includes(this.searchPermission.toLowerCase());
      });
    }
  },
  methods: {
    onChangeDragList(ev: any, propData: string) {
      if (ev.hasOwnProperty(VueDraggableEvents.Removed)) {
        if (propData === PermissionGroup.All) {
          this.allPermissions = this.allPermissions.filter((permission: RoleType) => permission._id !== ev.removed.element._id);
        } else if (propData === PermissionGroup.Self) {
          this.selfPermissions = this.selfPermissions.filter((permission: RoleType) => permission._id !== ev.removed.element._id);
        }
      } else if (ev.hasOwnProperty(VueDraggableEvents.Added)) {
        if (propData === PermissionGroup.All) {
          this.allPermissions.splice(ev.added.newIndex, 0, ev.added.element);
        } else if (propData === PermissionGroup.Self) {
          this.selfPermissions.splice(ev.added.newIndex, 0, ev.added.element);
        }
      }
    },
    async saveProfile() {
      this.updateProfilePermissions();
      if (await this.isFormValid(this.$refs.profileObserver as FormContext)) {
        this.$loader.activate(LOADER_MESSAGES.SAVE_PROFILE);
        Meteor.call('profile.save', this.profile,
            (error: Meteor.Error, response: ResponseMessage) => {
              this.$loader.deactivate();
              if (error) {
                this.$alert.showAlertSimple('error', error.reason);
              } else {
                this.$alert.showAlertSimple('success', response.message);
                this.$router.push({name: 'home.profiles'});
              }
            });
      }
    },
    updateProfilePermissions() {
      this.profile.permissions = this.selfPermissions.map((roleType: RoleType) => roleType._id);
    },
    initPermissionLists() {
      Meteor.call('permissions.listOthersForIdProfile', {profileId: this.profile._id},
          (err: Meteor.Error, response: RoleType[]) => {
            if (err) {
              console.error('Error listing permissions: ', err);
              return;
            }
            this.allPermissions = response;
          });

      Meteor.call('permissions.listByIdProfile', {profileId: this.profile._id},
          (err: Meteor.Error, response: RoleType[]) => {
            if (err) {
              console.error('Error listing profile permissions: ', err);
              return;
            }
            this.selfPermissions = response;
          });
    },
    listAllPermissions() {
      Meteor.call('permissions.list', (err: Meteor.Error, response: RoleType[]) => {
        if (err) {
          console.error('Error listing all permissions: ', err);
          return;
        }
        this.allPermissions = response;
      });
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
