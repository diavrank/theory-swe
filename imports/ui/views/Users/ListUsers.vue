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
      <v-data-table :headers="headers" :items="users" @dblclick:row="(event,{item})=>openEditUser(item)">
        <template v-slot:item.profile.path="{item}">
          <div class="d-flex align-center pt-5 pb-5">
            <v-avatar>
                    <span v-if="item.profile.path == null" class="white--text text-h5">
                        {{ item.username | initials(2) }}
                    </span>
              <img v-else :src="item.profile.path || '/img/user.png'" alt="Avatar">
            </v-avatar>
          </div>
        </template>
        <template v-slot:item.status.online="{item}">
          <div class="d-flex align-center pt-5 pb-5">
            <v-icon :color="item.status.online?'green':'red'">
              mdi-checkbox-blank-circle
            </v-icon>
          </div>
        </template>
        <template v-slot:item.action="{ item }">
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
        </template>
      </v-data-table>
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
import { mapMutations } from 'vuex';
import Vue, { VueConstructor } from 'vue';
import { ModalData, DatatableHeader } from '/imports/ui/typings/utilities';
import AlertMessage from './../../components/Utilities/Alerts/AlertMessage.vue';
import { Meteor } from 'meteor/meteor';
import Loader from './../../components/Utilities/Loaders/Loader.vue';
import { ResponseMessage } from '/imports/startup/server/utils/ResponseMessage';
import { User } from '/imports/ui/typings/users';

export default (Vue as VueConstructor<Vue &
    {
      $refs: {
        refModalRemove: InstanceType<typeof ModalRemove>
      },
      $alert: InstanceType<typeof AlertMessage>,
      $loader: InstanceType<typeof Loader>
    }
    >).extend({
  name: 'ListUsers',
  components: { ModalRemove },
  data: () => ({
    modalData: {
      mainNameElement: '',
      _id: undefined,
      element: {}
    } as ModalData,
    headersData: {
      path: '',
      status: {},
      fullname: '',
      username: '',
      email: ''
    }
  }),
  computed: {
    headers(): DatatableHeader[] {
      const self = this;
      return [
        {
          value: 'profile.path',
          text: 'Image',
          sortable: false,
          class: ['subtitle-1', 'font-weight-light']
        },
        {
          value: 'status.online',
          text: 'Online',
          sortable: true,
          class: ['subtitle-1', 'font-weight-light']
        },
        {
          value: 'profile.name',
          text: 'Full name',
          sortable: true,
          class: ['subtitle-1', 'font-weight-light'],
          filter(value: any): boolean {
            return value != null &&
                typeof value === 'string' &&
                value.toString().toLocaleLowerCase()
                    .indexOf(self.headersData.fullname.toLocaleLowerCase()) !== -1;
          }
        },
        {
          value: 'username',
          text: 'Username',
          sortable: true,
          class: ['subtitle-1', 'font-weight-light'],
          filter(value: any): boolean {
            return value != null &&
                typeof value === 'string' &&
                value.toString().toLocaleLowerCase()
                    .indexOf(self.headersData.username.toLocaleLowerCase()) !== -1;
          }
        },
        {
          value: 'emails[0].address',
          text: 'Email',
          sortable: true,
          class: ['subtitle-1', 'font-weight-light'],
          divider: true,
          filter(value: any): boolean {
            return value != null &&
                typeof value === 'string' &&
                value.toString().indexOf(self.headersData.email) !== -1;
          }
        },
        {
          value: 'action', text: 'Options', sortable: false, align: 'center',
          class: ['subtitle-1', 'font-weight-light']
        }];
    }
  },
  methods: {
    ...mapMutations('temporal', ['setElement']),
    openEditUser(user: User): void{
      this.setElement(user);
      this.$router.push({ name: 'home.users.edit' });
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
      Meteor.call('user.delete', { userId },
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
      return Meteor.users.find({ _id: { $ne: Meteor.userId() || undefined } }).fetch();
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
