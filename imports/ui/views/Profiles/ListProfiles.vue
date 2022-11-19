<template>
  <v-container>
    <v-row>
      <v-col xs="12" sm="12" offset-sm="0" md="6" offset-md="3">
        <div class="d-flex justify-space-between align-baseline mb-5">
          <div class="text-h4 font-weight-light">Profiles</div>
          <v-tooltip bottom transition="fab-transition">
            <template v-slot:activator="{on}">
              <v-btn v-can:create.hide="'profiles'" color="success" v-on="on" fab theme="dark"
                     :to="{name: 'home.profiles.create'}">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <span>Add profile</span>
          </v-tooltip>
        </div>
        <div class="section elevation-1">
          <v-table @dblclick:row="(event,{item})=>openEditProfile(item)">
            <thead>
            <tr>
              <th class="text-left">
                Profile name
              </th>
              <th class="text-left">
                Options
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in profiles"
                :key="item._id"
            >
              <td>{{ item.description }}</td>
              <td>
                <v-tooltip bottom transition="fab-transition">
                  <template v-slot:activator="{on}">
                    <v-btn v-can:edit.hide="'profiles'" fab color="success" v-on="on" x-small class="mr-2"
                           @click="openEditProfile(item)">
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit</span>
                </v-tooltip>
                <v-tooltip bottom transition="fab-transition">
                  <template v-slot:activator="{on}">
                    <v-btn v-can:delete.hide="'profiles'" fab color="error" v-on="on" x-small class="mr-2"
                           @click="openRemoveModal(item)">
                      <v-icon>close</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove</span>
                </v-tooltip>
              </td>
            </tr>
            </tbody>
          </v-table>
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
import { mapMutations } from 'vuex';
import ModalRemove from './../../components/Utilities/Modals/ModalRemove.vue';
import profilesMixin from '../../mixins/accounts/profiles';
import  {defineComponent} from 'vue';
import { Profile } from '../../typings/users';
import { ModalData } from '/imports/ui/typings/utilities';
import { Meteor } from 'meteor/meteor';
import { ResponseMessage } from '/imports/startup/server/utils/ResponseMessage';

export default defineComponent({
  name: 'ListProfiles',
  components: { ModalRemove },
  mixins: [profilesMixin],
  data: () => ({
    modalData: {
      mainNameElement: '',
      _id: undefined,
      element: {}
    } as ModalData,
    headers: [
      {
        value: 'description',
        text: 'Profile name',
        sortable: true,
        divider: true,
        class: ['subtitle-1', 'font-weight-light']
      },
      {
        value: 'action', text: 'Options', sortable: false, align: 'center',
        class: ['subtitle-1', 'font-weight-light']
      }]
  }),
  methods: {
    ...mapMutations('temporal', ['setElement']),
    openRemoveModal(profile: Profile) {
      this.modalData.element = profile;
      this.modalData._id = profile._id;
      this.modalData.element.removed = false;
      this.modalData.mainNameElement = profile.description;
      this.$refs.refModalRemove.dialog = true;
    },
    openEditProfile(profile: Profile) {
      this.setElement(profile);
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
          this.$alert.showAlertSimple('success', response.message);
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
