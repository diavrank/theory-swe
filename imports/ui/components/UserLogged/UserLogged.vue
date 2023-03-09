<template>
  <v-menu offset-y>
    <template v-slot:activator="{props}">
      <v-btn variant="text" v-bind="props">
        <v-avatar color="indigo" size="36">
                    <span v-if="user.profile.path==null" class="text-white text-h5">
                        {{ usernameInitials }}
                    </span>
          <v-img v-else id="face-preview" :src="user.profile.path"
               :alt="user.username" />
        </v-avatar>
      </v-btn>
    </template>
    <v-list>
      <v-list-item :to="{name:'home.account'}">Account</v-list-item>
      <v-list-item href="#" @click="closeSession()">Logout</v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Meteor } from 'meteor/meteor';
import { User } from '@typings/users';
import { LogoutHook } from '@typings/accounts';
import { computed, defineComponent, inject, onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '/imports/ui/stores/auth';
import { useRouter } from 'vue-router';
import { Injections } from '@typings/utilities';
import { Emitter, EventType } from 'mitt';

declare module Accounts {
  function onLogout(func: Function): LogoutHook;
}

export default defineComponent({
  name: 'UserLogged',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const emitter = inject<Emitter<Record<EventType, unknown>>>(Injections.Emitter);
    const user: User = reactive({
      emails: [],
      profile: {}
    });
    const onLogoutHook: LogoutHook | null = ref(null);

    onMounted(() => {
      emitter?.on('setUserLogged', setSession);
      onLogoutHook.value = Accounts.onLogout(closeFrontSession);
    });

    const closeSession = () => {
      if (onLogoutHook.value) {
        onLogoutHook.value?.stop();
        Meteor.logout();
        authStore.logout();
        router.push({ name: 'login' });
      }
    };

    const closeFrontSession = () => {
      if (onLogoutHook.value) {
        onLogoutHook.value?.stop();
        authStore.logout();
        router.push({ name: 'login'});
      }
    };

    const setSession = () => {
      if (Meteor.userId() !== null) {
        Object.assign(user, authStore.user || {
          emails: [],
          profile: {}
        });
      } else {
        closeSession();
      }
    }

    const usernameInitials = computed(() => {
      let initials = '';
      if (user.username) {
        const words = user.username.split(' ');
        initials = words.reduce((acc, word) => {
          return acc + word[0];
        }, '');
      }
      return initials.toUpperCase();
    });

    setSession();

    return { user, usernameInitials, closeSession };
  }
});
</script>
