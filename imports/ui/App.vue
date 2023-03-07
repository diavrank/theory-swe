<template>
  <v-app id="allPageView">
    <router-view name="allPageView" v-slot="{Component}">
      <transition :name="$router.currentRoute.value.name" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
    <alert-message/>
    <loader/>
  </v-app>
</template>

<script lang="ts">
import AlertMessage from '@components/Utilities/Alerts/AlertMessage.vue';
import Loader from '@components/Utilities/Loaders/Loader.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: { AlertMessage, Loader },

});
</script>

<style>
#allPageView {
  background-color: #f5f5f5;
}

/* Cerrar sesión SPA */
.login-leave-active {
  transition: all .5s linear;
}

.login-leave-to {
  transform: scale(0);
  opacity: 0;
}

/*Cerrar sesión LOGIN*/
.login-enter-active {
  transition: all .5s linear .4s;
}

.login-enter-from {
  transform: scale(2);
  opacity: 0;
}

/*Transición al iniciar sesión */
.home-leave-active {
  transition: all .5s;
}

.home-leave-to {
  transform: scale(0);
}
</style>
