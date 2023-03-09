<template>
  <v-app id="allPageView">
    <router-view name="allPageView" v-slot="{Component}">
      <transition :name="$router.currentRoute.value.name" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
    <alert-message ref="alertMessage"/>
    <loader ref="loader"/>
  </v-app>
</template>

<script lang="ts">
import AlertMessage from '@components/Utilities/Alerts/AlertMessage.vue';
import Loader from '@components/Utilities/Loaders/Loader.vue';
import { defineComponent, onMounted, provide, ref } from 'vue';
import { Injections } from '@typings/utilities';
import mitt from 'mitt';

export default defineComponent({
  name: 'App',
  components: { AlertMessage, Loader },
  setup() {
    const alertMessage = ref(null);
    const loader = ref(null);

    onMounted(() => {
      provide(Injections.AlertMessage, alertMessage.value);
      provide(Injections.Loader, loader.value);
      const emitter = mitt();
      provide(Injections.Emitter, emitter);
    })

    return { alertMessage, loader };
  }
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
