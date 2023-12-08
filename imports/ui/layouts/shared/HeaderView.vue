<template>
  <v-app-bar class="header" elevation="0">
    <v-btn variant="text" @click="temporalStore.setDrawer(!temporalStore.drawer)">
      <v-icon>menu</v-icon>
    </v-btn>
    <breadcrumb></breadcrumb>
    <v-spacer></v-spacer>
    <user-logged></user-logged>
  </v-app-bar>
</template>

<script lang="ts">
import UserLogged from '@components/UserLogged/UserLogged.vue';
import Breadcrumb from './Breadcrumb.vue';
import { defineComponent } from 'vue';
import { useTemporalStore } from '/imports/ui/stores/temporal';

export default defineComponent({
  name: 'HeaderView',
  setup() {
    const temporalStore = useTemporalStore();
    return { temporalStore };
  },
  components: {
    Breadcrumb,
    UserLogged
  }
});
</script>

<style scoped>
.header {
  background-color: #f5f5f5 !important;
}
</style>
