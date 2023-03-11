<template>
  <v-container>
    <div class="d-flex justify-space-between align-baseline mb-5">
      <div class="text-h4 font-weight-light">Users</div>
      <v-tooltip location="bottom" transition="fab-transition">
        <template v-slot:activator="{props}">
          <v-btn v-bind="props" v-can:create.hide="'users'" color="success" icon="add" theme="dark"
                 :to="{name:'home.users.create'}">
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
                    <span v-if="item.raw.profile.path == null" class="text-dark text-h5">
                        {{ $filters.initials(item.raw.username, 2) }}
                    </span>
              <v-img v-else :src="item.raw.profile.path || '/img/user.png'" alt="Avatar"></v-img>
            </v-avatar>
          </div>
        </template>
        <template v-slot:item.status.online="{item}">
          <div class="d-flex align-center pt-5 pb-5">
            <v-icon :color="item.raw.status.online?'green':'red'">
              mdi:mdi-checkbox-blank-circle
            </v-icon>
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip location="bottom" transition="fab-transition">
            <template v-slot:activator="{props}">
              <v-btn v-can:edit.hide="'users'" icon="edit" color="success" v-bind="props" size="x-small" class="mr-2"
                     @click="openEditUser(item.raw)">
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip location="bottom" transition="fab-transition">
            <template v-slot:activator="{props}">
              <v-btn v-can:delete.hide="'users'" icon="close" color="error" v-bind="props" size="x-small" class="mr-2"
                     @click="openRemoveModal(item.raw)">
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
import ModalRemove from '@components/Utilities/Modals/ModalRemove.vue';
import { computed, defineComponent, inject, reactive, ref } from 'vue';
import { Injections, MeteorError, ModalData } from '@typings/utilities';
import { Meteor } from 'meteor/meteor';
import { ResponseMessage } from '@server/utils/ResponseMessage';
import { User } from '@typings/users';
import { useTemporalStore } from '/imports/ui/stores/temporal';
import { useRouter } from 'vue-router';
import { LoaderType } from '@components/Utilities/Loaders/Loader.vue';
import { AlertMessageType } from '@components/Utilities/Alerts/AlertMessage.vue';

export default defineComponent({
  name: 'ListUsers',
  components: { ModalRemove },
  setup() {
    const temporalStore = useTemporalStore();
    const router = useRouter();
    const refModalRemove = ref<InstanceType<typeof ModalRemove> | null>(null);
    const loader = inject<LoaderType>(Injections.Loader);
    const alert = inject<AlertMessageType>(Injections.AlertMessage);
    const modalData: ModalData = reactive({
      mainNameElement: '',
      _id: undefined,
      element: {}
    });
    const headersData = reactive({
      path: '',
      status: {},
      fullname: '',
      username: '',
      email: ''
    });

    const headers = computed(() => {
      return [
        {
          key: 'profile.path',
          title: 'Image',
          sortable: false,
          class: ['subtitle-1', 'font-weight-light']
        },
        {
          key: 'status.online',
          title: 'Online',
          sortable: true,
          class: ['subtitle-1', 'font-weight-light']
        },
        {
          key: 'profile.name',
          title: 'Full name',
          sortable: true,
          class: ['subtitle-1', 'font-weight-light'],
          filter(value: any): boolean {
            return value != null &&
                typeof value === 'string' &&
                value.toString().toLocaleLowerCase()
                    .indexOf(headersData.fullname.toLocaleLowerCase()) !== -1;
          }
        },
        {
          key: 'username',
          title: 'Username',
          sortable: true,
          class: ['subtitle-1', 'font-weight-light'],
          filter(value: any): boolean {
            return value != null &&
                typeof value === 'string' &&
                value.toString().toLocaleLowerCase()
                    .indexOf(headersData.username.toLocaleLowerCase()) !== -1;
          }
        },
        {
          key: 'emails[0].address',
          title: 'Email',
          sortable: true,
          class: ['subtitle-1', 'font-weight-light'],
          divider: true,
          filter(value: any): boolean {
            return value != null &&
                typeof value === 'string' &&
                value.toString().indexOf(headersData.email) !== -1;
          }
        },
        {
          key: 'action', title: 'Options', sortable: false, align: 'center',
          class: ['subtitle-1', 'font-weight-light']
        }];
    })

    const openEditUser = (user: User) => {
      temporalStore.setElement(user);
      router.push({ name: 'home.users.edit' });
    };

    const openRemoveModal = (user: User) => {
      modalData.element = user;
      modalData._id = user._id;
      modalData.element.removed = false;
      modalData.mainNameElement = user.profile.name;
      if (refModalRemove.value) {
        refModalRemove.value.dialog = true;
      }
    };

    const deleteUser = (userId: string) => {
      loader?.activate('Deleting user . . .');
      Meteor.call('user.delete', { userId }, (error: MeteorError, response: ResponseMessage) => {
        loader?.deactivate();
        if (error && error instanceof Meteor.Error) {
          console.error('Error to delete user: ', error);
          alert?.showAlertSimple('error', error.reason || '');
        } else {
          alert?.showAlertSimple('success', response.message + '');
        }
      })
    }

    return { refModalRemove, modalData, headers, openEditUser, openRemoveModal, deleteUser }

  },
  meteor: {
    $subscribe: {
      'users': []
    },
    users() {
      return Meteor.users.find({ _id: { $ne: Meteor.userId() || undefined } }).fetch();
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
