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
        <v-btn block type="submit" form="saveProfile" color="primary"
               v-text="dataView.targetButton" tabindex="4">
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col xs="12" sm="12" md="10" lg="8" xl="5">
        <div class="section elevation-1">
          <Form as="div" v-slot="{handleSubmit}" :initial-values="initialValues" ref="profileObserver">
            <v-form @submit="handleSubmit($event,saveProfile)" id="saveProfile" autocomplete="off">
              <v-row>
                <v-col md="6">
                  <Field v-slot="{ field, errors }" name="name" rules="required">
                    <v-text-field v-bind="field" v-model="profile.name"
                                  :error-messages="errors" label="Profile's name" required>
                    </v-text-field>
                  </Field>
                </v-col>
                <v-col md="6">
                  <Field v-slot="{ field, errors }" name="description" rules="required">
                    <v-text-field v-bind="field" v-model="profile.description" :error-messages="errors"
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
                                    id="inputSearchSelfPermission" name="inputSelfPermission">
                      </v-text-field>
                    </v-card-text>
                    <v-sheet
                        id="scrolling-techniques-2"
                        class="overflow-y-auto"
                        max-height="500">
                      <v-list style="height: 400px;">
                        <draggable :list="filteredSelfPermissions"
                                   class="list-group"
                                   @change="(ev) => onDraggedSelfPermissions(ev)"
                                   item-key="_id"
                                   group="permissions">
                          <template #item="{element: permission}">
                            <div>
                              <v-list-item class="list-group-item" v-text="permission.publicName"></v-list-item>
                              <v-divider></v-divider>
                            </div>
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
                        <draggable class="list-group" :list="filteredPermissions"
                                   @change="(ev) => onDraggedAllPermissions(ev)"
                                   item-key="_id"
                                   group="permissions">
                          <template #item="{element: permission}">
                            <div>
                              <v-list-item class="list-group-item" v-text="permission.publicName"></v-list-item>
                              <v-divider></v-divider>
                            </div>
                          </template>
                        </draggable>
                      </v-list>
                    </v-sheet>
                  </div>
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
import draggable from 'vuedraggable';
import { Field, Form, FormContext } from 'vee-validate';
import { computed, defineComponent, inject, onMounted, reactive, ref } from 'vue';
import { Meteor } from 'meteor/meteor';
import { ResponseMessage } from '@server/utils/ResponseMessage';
import { RoleType } from '@api/Permissions/Permission';
import { LOADER_MESSAGES } from '/imports/ui/constants/loader-messages.const';
import { Injections, MeteorError, VueDraggableEvents } from '@typings/utilities';
import { useTemporalStore } from '/imports/ui/stores/temporal';
import { useRoute, useRouter } from 'vue-router';
import { useFormValidation } from '/imports/ui/composables/forms';
import { LoaderType } from '@components/Utilities/Loaders/Loader.vue';
import { AlertMessageType } from '@components/Utilities/Alerts/AlertMessage.vue';

export default defineComponent({
  name: 'SaveProfile',
  components: {
    draggable,
    Form,
    Field
  },
  setup() {
    const temporalStore = useTemporalStore();
    const route = useRoute();
    const router = useRouter();
    const alert = inject<AlertMessageType>(Injections.AlertMessage);
    const loader = inject<LoaderType>(Injections.Loader);
    const profileObserver = ref(null);
    const dataView = reactive({
      title: '',
      targetButton: ''
    });
    const profile = reactive({
      _id: undefined,
      name: null as string | null,
      description: null as string | null,
      permissions: [] as string[]
    });
    const initialValues = reactive({
      name: null as string | null,
      description: null as string | null
    });
    const { onChangeDragList: onDraggedAllPermissions, ...allPermissionsStates } = useAllPermissions();
    const { onChangeDragList: onDraggedSelfPermissions, ...selfPermissionsStates } = useSelfPermissions();

    onMounted(() => {
      if (route.meta.type === 'create') {
        dataView.title = 'Create profile';
        dataView.targetButton = 'Create';
        allPermissionsStates.listAllPermissions();
      } else if (route.meta.type === 'edit') {
        dataView.title = 'Edit profile';
        dataView.targetButton = 'Update';
        if (temporalStore.element) {
          Object.assign(profile, temporalStore.element);
          selfPermissionsStates.initPermissionsList(profile);
          allPermissionsStates.initPermissionsList(profile);
          Object.assign(initialValues, profile);
        } else {
          router.push({ name: 'home.profiles' });
        }
      }
    });

    const saveProfile = async () => {
      profile.permissions = selfPermissionsStates.getProfilePermissions();
      const observer = profileObserver.value as FormContext | null;
      if (observer && alert && await useFormValidation(observer, alert)) {
        loader?.activate(LOADER_MESSAGES.SAVE_PROFILE);
        Meteor.call('profile.save', profile, (error: MeteorError, response: ResponseMessage) => {
          loader?.deactivate();
          if (error && error instanceof Meteor.Error) {
            alert?.showAlertSimple('error', error.reason + '');
          } else {
            alert?.showAlertSimple('success', response.message + '');
            router.push({ name: 'home.profiles' });
          }
        })
      }
    };

    return {
      profileObserver, dataView, profile, initialValues, saveProfile,
      onDraggedAllPermissions, ...allPermissionsStates,
      onDraggedSelfPermissions, ...selfPermissionsStates
    };
  }
});

const useSelfPermissions = () => {
  const selfPermissions = ref<RoleType[]>([]);
  const searchSelfPermission = ref('');

  const filteredSelfPermissions = computed(() => {
    return selfPermissions.value.filter(permission => {
      return permission.publicName.toLowerCase().includes(searchSelfPermission.value.toLowerCase());
    })
  });

  const getProfilePermissions = () => {
    return selfPermissions.value.map((roleType: RoleType) => roleType._id);
  };

  const initPermissionsList = (profile: any) => {
    Meteor.call('permissions.listByIdProfile', { profileId: profile._id },
        (err: Meteor.Error, response: RoleType[]) => {
          if (err) {
            console.error('Error listing profile permissions: ', err);
            return;
          }
          selfPermissions.value = response;
        });
  };

  const onChangeDragList = (ev: any) => {
    if (ev.hasOwnProperty(VueDraggableEvents.Removed)) {
      selfPermissions.value = selfPermissions.value.filter((permission: RoleType) => permission._id !== ev.removed.element._id);
    } else if (ev.hasOwnProperty(VueDraggableEvents.Added)) {
      selfPermissions.value.splice(ev.added.newIndex, 0, ev.added.element);
    }
  };

  return { selfPermissions, searchSelfPermission, filteredSelfPermissions,
    getProfilePermissions, initPermissionsList, onChangeDragList,  };
};

const useAllPermissions = () => {
  const allPermissions = ref<RoleType[]>([]);
  const searchPermission = ref('');

  const filteredPermissions = computed(() => {
    return allPermissions.value.filter(permission => {
      return permission['publicName'].toLowerCase().includes(searchPermission.value.toLowerCase());
    })
  });

  const initPermissionsList = (profile: any) => {
    Meteor.call('permissions.listOthersForIdProfile', { profileId: profile._id },
        (err: Meteor.Error, response: RoleType[]) => {
          if (err) {
            console.error('Error listing permissions: ', err);
            return;
          }
          allPermissions.value = response;
        });
  };

  const listAllPermissions = () => {
    Meteor.call('permissions.list', (err: MeteorError, response: RoleType[]) => {
      if (err) {
        console.error('Error listing all permissions: ', err);
        return;
      }
      allPermissions.value = response;
    });
  };

  const onChangeDragList = (ev: any) => {
    if (ev.hasOwnProperty(VueDraggableEvents.Removed)) {
      allPermissions.value = allPermissions.value.filter((permission: RoleType) => permission._id !== ev.removed.element._id);
    } else if (ev.hasOwnProperty(VueDraggableEvents.Added)) {
      allPermissions.value.splice(ev.added.newIndex, 0, ev.added.element);
    }
  };

  return { allPermissions, searchPermission, filteredPermissions,
    initPermissionsList, listAllPermissions, onChangeDragList }
};
</script>

<style scoped lang="sass">
.section
  padding: 25px
  background-color: white
  border-radius: 10px

.list-group-item
  cursor: move
</style>
