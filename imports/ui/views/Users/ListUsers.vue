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
      <v-data-table-server
        :headers="headers"
        :items="users"
        :items-length="pagination.total"
        :loading="loading"
        loading-text="Loading... Please wait"
        v-model:page="pagination.page"
        v-model:items-per-page="pagination.itemsPerPage"
        @update:options="loadUsers"
        density="compact"
        @dblclick:row="(event,{item})=>openEditUser(item)">
        <template v-slot:item.avatar="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="x-small">
                    <span v-if="item.profile.path == null" class="text-dark text-h5">
                        {{ $filters.initials(item.username, 2) }}
                    </span>
              <v-img v-else :src="item.profile.path || '/img/user.png'" alt="Avatar"></v-img>
            </v-avatar>
          </div>
        </template>
        <template v-slot:item.status="{ item }">
          <div class="d-flex align-center">
            <v-icon :color="item.status.online?'green':'red'">
              mdi:mdi-checkbox-blank-circle
            </v-icon>
          </div>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip location="bottom" transition="fab-transition">
            <template v-slot:activator="{props}">
              <v-btn v-can:edit.hide="'users'" variant="text" icon="edit" color="success" v-bind="props" size="x-small" class="mr-2"
                     @click="openEditUser(item)">
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip location="bottom" transition="fab-transition">
            <template v-slot:activator="{props}">
              <v-btn v-can:delete.hide="'users'" variant="text" icon="close" color="error" v-bind="props" size="x-small" class="mr-2"
                     @click="openRemoveModal(item)">
              </v-btn>
            </template>
            <span>Remove</span>
          </v-tooltip>
        </template>
      </v-data-table-server>
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
import { ResponseMessage } from '@server/utils/ResponseMessage';
import { User } from '@typings/users';
import { ModalData } from '@typings/utilities';
import { Meteor } from 'meteor/meteor';
import { mapActions } from 'pinia';
import { defineComponent } from 'vue';
import { UserResponseDto } from '/imports/api/Users/dtos/user-response.dto';
import { useTemporalStore } from '/imports/ui/stores/temporal';

export default defineComponent({
  name: 'ListUsers',
  components: { ModalRemove },
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
    usersSubscription: null,
    headersData: {
      path: '',
      status: {},
      fullname: '',
      username: '',
      email: ''
    }
  }),
  computed: {
    headers() {
      const self = this;
      return [
        {
          key: 'avatar',
          title: 'Image',
          sortable: false,
          class: ['subtitle-1', 'font-weight-light']
        },
        {
          key: 'status',
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
                    .indexOf(self.headersData.fullname.toLocaleLowerCase()) !== -1;
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
                    .indexOf(self.headersData.username.toLocaleLowerCase()) !== -1;
          }
        },
        {
          key: 'email',
          title: 'Email',
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
          key: 'action', title: 'Options', sortable: false, align: 'center',
          class: ['subtitle-1', 'font-weight-light']
        }];
    }
  },
  mounted() {
    this.loadTotalUsers();
  },
  methods: {
    ...mapActions(useTemporalStore, ['setElement']),
    loadTotalUsers(): void {
      Meteor.call('users.getTotal', (err: Meteor.Error, total: number) => {
        if (err) {
          console.error('Error counting users: ', err);
          this.$alert.showAlertSimple('error', err.reason);

          return;
        }
        this.pagination.total = total || 0;
        this.loading = false;
      });
    },
    openEditUser(user: UserResponseDto): void {
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
              this.loadTotalUsers();
            }
          });
    },
    loadUsers({page, itemsPerPage}){
      this.loading = true;
      if(this.usersSubscription){
        this.usersSubscription.sub.stop();
      }
      this.usersSubscription = this.$subscribe('users',{page,limit: itemsPerPage});    
    }
  },
  watch: {
      'usersSubscription.sub.ready'(newValue) {
          if (newValue) {
            this.loading = false;
          }
      }
  },
  meteor:{
    users() {
      //TODO: Sort by name
      return Meteor.users
          .find({ _id: { $ne: Meteor.userId() || undefined } })
          .fetch();
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
