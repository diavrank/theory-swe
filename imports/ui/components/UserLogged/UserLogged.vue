<template>
  <v-menu offset-y>
    <template v-slot:activator="{on}">
      <v-btn text v-on="on">
        <v-avatar color="indigo" size="36">
                    <span v-if="user.profile.path==null" class="white--text text-h5">
                        {{ usernameInitials }}
                    </span>
          <img v-else id="face-preview" :src="user.profile.path"
               :alt="user.username">
        </v-avatar>
      </v-btn>
    </template>
    <v-list>
      <v-list-item :to="{name:'home.account'}">Cuenta</v-list-item>
      <v-list-item href="#" @click="closeSession()">Cerrar sesión</v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { mapMutations } from 'vuex';
import Vue from 'vue';
import { Meteor } from 'meteor/meteor';
import { User } from '/imports/ui/typings/users';
import { LogoutHook } from './../../typings/accounts'

declare module Accounts {
  function onLogout(func: Function): LogoutHook;
}

export default Vue.extend({
  name: 'UserLogged',
  data() {
    return {
      user: {
        emails: [],
        profile: {},
      } as User,
      onLogoutHook: null as LogoutHook | null
    };
  },
  created() {
    // console.log("Loading data By vuex",this.$store.state.auth.user);
    this.setSession();

  },
  mounted() {
    this.$root.$on('setUserLogged', () => {
      this.setSession();
    });
    this.onLogoutHook = Accounts.onLogout(() => {
      this.closeFrontSession();
    });
  },
  methods: {
    ...mapMutations('auth', ['logout']),
    closeSession() {
      if (this.onLogoutHook) {
        this.onLogoutHook.stop();
        Meteor.logout();
        this.logout();
        this.$router.push({ name: 'login' });
      }
    },
    closeFrontSession(){
      if (this.onLogoutHook) {
        this.onLogoutHook.stop();
        this.logout();
        this.$router.push({ name: 'login' });
      }
    },
    setSession() {
      if (Meteor.userId() !== null) {
        this.user = this.$store.state.auth.user;
      } else {
        this.closeSession();
      }
    }
  },
  computed: {
    usernameInitials() {
      let initials = '';
      if (this.user.username) {
        const words = this.user.username.split(' ');
        initials = words.reduce((acc, word) => {
          return acc + word[0];
        }, '');
      }
      return initials.toUpperCase();
    }
  }
})
</script>

<style>

</style>
