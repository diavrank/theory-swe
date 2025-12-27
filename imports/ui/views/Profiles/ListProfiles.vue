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
          <v-data-table-server
            :headers="headers"
            :items="profiles"
            :items-length="pagination.total"
            :loading="loading"
            loading-text="Loading... Please wait"
            v-model:page="pagination.page"
            v-model:items-per-page="pagination.itemsPerPage"
            @update:options="loadProfiles"
            :sort-by="[{ key: 'description', order: 'asc' }]"
            density="compact"
            @dblclick:row="(event,{item})=>openEditProfile(item)">
            <template v-slot:item.action="{ item }">
              <v-tooltip location="bottom" transition="fab-transition">
                <template v-slot:activator="{props}">
                  <v-btn v-can:edit.hide="'profiles'" icon="edit" color="success" v-bind="props" size="x-small" class="mr-2"
                         @click="openEditProfile(item)">
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip location="bottom" transition="fab-transition">
                <template v-slot:activator="{props}">
                  <v-btn v-can:delete.hide="'profiles'" icon="close" color="error" v-bind="props" size="x-small" class="mr-2"
                         @click="openRemoveModal(item)">
                  </v-btn>
                </template>
                <span>Remove</span>
              </v-tooltip>
            </template>
          </v-data-table-server>
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
import { ResponseMessage } from '@server/utils/ResponseMessage';
import { Profile } from '@typings/users';
import { ModalData } from '@typings/utilities';
import { Meteor } from 'meteor/meteor';
import { defineComponent } from 'vue';
import { ProfileResponseDto } from '/imports/api/Profiles/dtos/profile-response.dto';
import { ProfilesPaginatedResponseDto } from '/imports/api/Profiles/dtos/profiles-paginated-response.dto';
import { useTemporalStore } from '/imports/ui/stores/temporal';

export default defineComponent({
  name: 'ListProfiles',
  components: { ModalRemove },
  setup() {
    const temporalStore = useTemporalStore();
    return {temporalStore};
  },
  data: () => ({
    modalData: {
      mainNameElement: '',
      _id: undefined,
      element: {}
    } as ModalData,
    loading: true,
    pagination: {
      page: 1,
      itemsPerPage: 10,
      total: 0
    },
    profiles: [] as ProfileResponseDto[],
    headers: [
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
      }]
  }),
  mounted() {
    this.loadProfiles({ page: this.pagination.page, itemsPerPage: this.pagination.itemsPerPage });
  },
  methods: {
    loadProfiles({ page, itemsPerPage }: { page: number; itemsPerPage: number }) {
      this.loading = true;
      Meteor.call('profile.listPaginated', { page, limit: itemsPerPage },
          (error: Meteor.Error, response: ProfilesPaginatedResponseDto) => {
            if (error) {
              console.error('Error listing profiles: ', error);
              this.$alert.showAlertSimple('error', error.reason);
              this.loading = false;
              return;
            }

            this.profiles = response?.data || [];
            this.pagination.total = response?.total || 0;
            this.loading = false;
          });
    },
    openRemoveModal(profile: Profile) {
      this.modalData.element = profile;
      this.modalData._id = profile.id;
      this.modalData.element.removed = false;
      this.modalData.mainNameElement = profile.description;
      this.$refs.refModalRemove.dialog = true;
    },
    openEditProfile(profile: Profile) {
      this.temporalStore.setElement(profile);
      this.$router.push({ name: 'home.profiles.edit' });
    },
    deleteProfile(profileId: Profile) {
      this.$loader.activate();
      Meteor.call('profile.delete', { profileId },
          (err: Meteor.Error,
           response: ResponseMessage) => {
        this.$loader.deactivate();
        if (err) {
          console.error('There was an error in deleteProfile: ', err);
          if (err.reason === 'Profile cannot be removed') {
            this.$alert.showAlertFull('warning', 'error',
                err.reason, 'multi-line', 5000,  'bottom right', err.details);
          } else {
            this.$alert.showAlertSimple('error', err.reason);
          }

        } else {
          this.$alert.showAlertSimple('success', 'Profile removed successfully!');
          this.loadProfiles({ page: this.pagination.page, itemsPerPage: this.pagination.itemsPerPage });
        }
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
