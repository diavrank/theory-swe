<template>
  <v-container>
    <div class="d-flex justify-space-between align-baseline mb-5">
      <div class="text-h4 font-weight-light">Users</div>
      <v-tooltip bottom transition="fab-transition">
        <template v-slot:activator="{on}">
          <v-btn v-can:create.hide="'users'" color="success" v-on="on" fab dark
                 :to="{name:'home.users.create'}">
            <v-icon>add</v-icon>
          </v-btn>
        </template>
        <span>Add user</span>
      </v-tooltip>
    </div>
    <div class="section elevation-1">
      <v-table @dblclick:row="(event,{item})=>openEditUser(item)">
        <thead>
        <tr>
          <th class="text-left">
            Image
          </th>
          <th class="text-left">
            Online
          </th>
          <th class="text-left">
            Full name
          </th>
          <th class="text-left">
            Username
          </th>
          <th class="text-left">
            Email
          </th>
          <th class="text-left">
            Options
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in users"
            :key="item._id"
        >
          <td>
            <div class="d-flex align-center pt-5 pb-5">
              <v-avatar>
                    <span v-if="item.profile.path == null" class="white--text text-h5">
                        {{ item.username | initials(2) }}
                    </span>
                <img v-else :src="item.profile.path || '/img/user.png'" alt="Avatar">
              </v-avatar>
            </div>
          </td>
          <td>
            <div class="d-flex align-center pt-5 pb-5">
              <v-icon :color="item.status.online?'green':'red'">
                mdi-checkbox-blank-circle
              </v-icon>
            </div>
          </td>
          <td>
            <v-tooltip bottom transition="fab-transition">
              <template v-slot:activator="{on}">
                <v-btn v-can:edit.hide="'users'" fab color="success" v-on="on" x-small class="mr-2"
                       @click="openEditUser(item)">
                  <v-icon>edit</v-icon>
                </v-btn>
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip bottom transition="fab-transition">
              <template v-slot:activator="{on}">
                <v-btn v-can:delete.hide="'users'" fab color="error" v-on="on" x-small class="mr-2"
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
                    preposition="al"
                    type-element="usuario"
                    :modalData="modalData"
                    @id_element="deleteUser"></modal-remove>
    </div>
  </v-container>
</template>

<script lang="ts">
import ModalRemove from '../../components/Utilities/Modals/ModalRemove.vue';
import {mapMutations} from 'vuex';
import {defineComponent} from 'vue';
import {ModalData} from '/imports/ui/typings/utilities';
import {Meteor} from 'meteor/meteor';
import {ResponseMessage} from '/imports/startup/server/utils/ResponseMessage';
import {User} from '/imports/ui/typings/users';

export default defineComponent({
  name: 'ListUsers',
  components: {ModalRemove},
  data: () => ({
    modalData: {
      mainNameElement: '',
      _id: undefined,
      element: {}
    } as ModalData,
  }),
  methods: {
    ...mapMutations('temporal', ['setElement']),
    openEditUser(user: User): void {
      this.setElement(user);
      this.$router.push({name: 'home.users.edit'});
    },
    openRemoveModal(user: User): void {
      this.modalData.element = user;
      this.modalData._id = user._id;
      this.modalData.element.removed = false;
      this.modalData.mainNameElement = user.profile.name;
      this.$refs.refModalRemove.dialog = true;
    },
    deleteUser(userId: string): void {
      this.$loader.activate();
      Meteor.call('user.delete', {userId},
          (err: Meteor.Error, response: ResponseMessage) => {
            this.$loader.deactivate();
            if (err) {
              console.error('Error to delete user: ', err);
              this.$alert.showAlertSimple('error', err.reason);
            } else {
              this.$alert.showAlertSimple('success', response.message);
            }
          });
    }
  },
  meteor: {
    $subscribe: {
      'users': []
    },
    users() {
      return Meteor.users.find({_id: {$ne: Meteor.userId() || undefined}}).fetch();
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
