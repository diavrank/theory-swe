<template>
  <v-container>
    <v-row>
      <v-col xs="12" sm="12" offset-sm="0" md="6" offset-md="3">
        <div class="d-flex justify-space-between align-baseline mb-5">
          <div class="text-h4 font-weight-light">Profiles</div>
          <v-tooltip location="bottom" transition="fab-transition">
            <template v-slot:activator="{props}">
              <v-btn v-can:create.hide="'profiles'" color="success" v-bind="props" icon="add" theme="dark"
                     :to="{name: 'home.profiles.create'}">
              </v-btn>
            </template>
            <span>Add profile</span>
          </v-tooltip>
        </div>
        <div class="section elevation-1">
          <v-data-table :headers="headers" :items="profiles" :sort-by="[{ key: 'description', order: 'asc' }]"
                        @dblclick:row="(event,{item})=>openEditProfile(item)">
            <template v-slot:item.action="{ item }">
              <v-tooltip location="bottom" transition="fab-transition">
                <template v-slot:activator="{props}">
                  <v-btn v-can:edit.hide="'profiles'" icon="edit" color="success" v-bind="props" size="x-small" class="mr-2"
                         @click="openEditProfile(item.raw)">
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip location="bottom" transition="fab-transition">
                <template v-slot:activator="{props}">
                  <v-btn v-can:delete.hide="'profiles'" icon="close" color="error" v-bind="props" size="x-small" class="mr-2"
                         @click="openRemoveModal(item.raw)">
                  </v-btn>
                </template>
                <span>Remove</span>
              </v-tooltip>
            </template>
          </v-data-table>
          <modal-remove ref="refModalRemove"
                        preposition="el"
                        type-element="perfil"
                        v-bind:modalData="modalData"
                        @id_element="deleteProfile"></modal-remove>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import ModalRemove from '@components/Utilities/Modals/ModalRemove.vue';
import profilesMixin from '@mixins/accounts/profiles';
import { defineComponent, inject, reactive, ref } from 'vue';
import { Profile } from '@typings/users';
import { Injections, MeteorError, ModalData } from '@typings/utilities';
import { Meteor } from 'meteor/meteor';
import { ResponseMessage } from '@server/utils/ResponseMessage';
import { useTemporalStore } from '/imports/ui/stores/temporal';
import { useRouter } from 'vue-router';
import { LoaderType } from '@components/Utilities/Loaders/Loader.vue';
import { AlertMessageType } from '@components/Utilities/Alerts/AlertMessage.vue';

export default defineComponent({
  name: 'ListProfiles',
  components: { ModalRemove },
  mixins: [profilesMixin],
  setup() {
    const refModalRemove = ref<InstanceType<typeof ModalRemove> | null>(null);
    const router = useRouter();
    const loader = inject<LoaderType>(Injections.Loader);
    const alert = inject<AlertMessageType>(Injections.AlertMessage);
    const temporalStore = useTemporalStore();
    const modalData: ModalData = reactive({
      mainNameElement: '',
      _id: undefined,
      element: {}
    });
    const headers = ref([
      {
        key: 'description',
        title: 'Profile name',
        sortable: true,
        divider: true,
        class: ['subtitle-1', 'font-weight-light']
      },
      {
        key: 'action', title: 'Options', sortable: false, align: 'center',
        class: ['subtitle-1', 'font-weight-light']
      }]);

    const openRemoveModal = (profile: Profile) => {
      modalData.element = profile;
      modalData._id = profile._id;
      modalData.element.removed = false;
      modalData.mainNameElement = profile.description;
      if (refModalRemove.value) {
        refModalRemove.value.dialog = true;
      }
    };

    const openEditProfile = (profile: Profile) => {
      temporalStore.setElement(profile);
      router.push({ name: 'home.profiles.edit' });
    };

    const deleteProfile = (profileId: Profile) => {
      loader?.activate('Deleting profile . . .');
      Meteor.call('profile.delete',  { profileId}, (error: MeteorError, response: ResponseMessage) => {
        loader?.deactivate();
        if (error && error instanceof Meteor.Error) {
          console.error('There was an error in deleteProfile: ', error);
          if (error.reason === 'Profile cannot be removed') {
            alert?.showAlertFull('warning', 'error', error.reason, 'multi-line',
                5000, 'bottom right', error.details);
          } else {
            alert?.showAlertSimple('error', error.reason || '');
          }
        } else {
          alert?.showAlertSimple('success', response.message || '');
        }
      })
    }

    return { refModalRemove, modalData, headers, openRemoveModal, openEditProfile, deleteProfile };
  }
})
</script>

<style scoped lang="sass">
.section
  padding: 25px
  background-color: white
  border-radius: 10px
</style>
