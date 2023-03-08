<template>
  <v-navigation-drawer
      app
      theme="dark"
      hide-overlay
      overlay-color="#000"
      :overlay-opacity="0"
      @input="toggle($event)"
      v-model="navigationDrawer"
      image="/img/meteorImpact.jpg">
    <template v-slot:prepend>
      <div class="overlay"></div>
    </template>
    <v-list dense
            nav
            class="py-0">
      <v-list-item class="pa-5 text-center"
                   prepend-avatar="/img/meteor-vue.png"
                   title="TheorySwe">
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list :lines="false" density="compact" nav v-model="optionSelected" class="py-0">
      <v-list-item v-for="(option,i) in options" :key="i" :to="{ name: option.namePath }"
                   :value="option" active-color="primary">
        <template v-slot:prepend>
          <v-icon :icon="option.icon"></v-icon>
        </template>
        <v-list-item-title>{{ option.title }}</v-list-item-title>
        <v-divider v-if="option.divider"></v-divider>
      </v-list-item>
    </v-list>
    <footer-view></footer-view>
  </v-navigation-drawer>
</template>

<script lang="ts">
import FooterView from './FooterView.vue';
import { defineComponent, ref, watch } from 'vue';
import { Meteor } from 'meteor/meteor';
import { useTemporalStore } from '/imports/ui/stores/temporal';
import { MeteorError } from '@typings/utilities';
import { useRoute } from 'vue-router';

interface SystemOption {
  title: string;
  namePath: string;
  icon: string;
  divider: boolean;
}

export default defineComponent({
  name: 'NavigationDrawer',
  components: {FooterView},
  setup() {
    const temporalStore = useTemporalStore();
    const options = ref<SystemOption[]>([]);
    const optionSelected = ref(0);
    const navigationDrawer = ref<null | boolean>(null);
    const route = useRoute();

    Meteor.call('getSystemOptions', (error: MeteorError, response: SystemOption[]) => {
      if (error) {
        console.error('Failed to get system options', error);
      } else {
        options.value = response;
      }
    });

    const updateSelectedOption = () => {
      const selected = options.value.filter(option => option.namePath === route.name);
      if (selected.length > 0) {
        optionSelected.value = options.value.indexOf(selected[0]);
      }
    };

    const toggle = (isShowed: boolean) => {
      navigationDrawer.value = isShowed;
      temporalStore.setDrawer(navigationDrawer);
    };

    watch(route, updateSelectedOption);
    watch(() => temporalStore.drawer, (newValue) => {
      navigationDrawer.value = newValue;
    }, { immediate: true });

    return { temporalStore, toggle, navigationDrawer, options, optionSelected };
  }
})
</script>

<style scoped lang="sass">
.overlay
  position: absolute
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))
  width: 100%
  height: 100%

  .active
    color: white
    background-color: var(--v-accent-base)

  .theme--dark.v-list-item--active:before
    opacity: 0
</style>
