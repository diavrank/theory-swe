<template>
  <v-app-bar>
    <v-btn variant="text" @click="setDrawer(!drawer)">
      <v-icon>menu</v-icon>
    </v-btn>
    <breadcrumb></breadcrumb>
    <v-spacer></v-spacer>
    <user-logged></user-logged>
  </v-app-bar>
</template>

<script lang="ts">
import UserLogged from '../../components/UserLogged/UserLogged.vue';
import Breadcrumb from './Breadcrumb.vue';
import { mapState, mapMutations } from 'vuex';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeaderView',
  components: {
    Breadcrumb,
    UserLogged
  },
  computed: {
    ...mapState('temporal', ['drawer'])
  },
  methods: {
    ...mapMutations('temporal', ['setDrawer'])
  }
});
</script>

<style scoped>

</style>
