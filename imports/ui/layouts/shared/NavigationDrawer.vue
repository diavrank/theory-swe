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
            :nav="true"
            class="py-0">
      <v-list-item class="pa-5 text-center"
                   prepend-avatar="/img/meteor-vue.png"
                   title="Scaffold">
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list :lines="false" density="compact" nav v-model="optionSelected" class="py-0">
      <v-list-item v-for="(option,i) in options" :key="i" :to="{ name: option.namePath }"
                   :value="option" color="primary">
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
import { defineComponent } from 'vue';
import { Meteor } from 'meteor/meteor';
import { useTemporalStore } from '/imports/ui/stores/temporal';

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
    return {temporalStore};
  },
  data: () => ({
    options: [] as SystemOption[],
    optionSelected: 0,
    navigationDrawer: null as boolean | null
  }),
  created() {
    Meteor.call('getSystemOptions', (err: Meteor.Error, options: SystemOption[]) => {
      if (err) {
        console.error('Failed to get system options', err);
      } else {
        this.options = options;
      }
    });
  },
  methods: {
    updateSelectedOption() {
      const optionSelected = this.options.filter(option => option.namePath === this.$route.name);
      if (optionSelected.length > 0) {
        this.optionSelected = this.options.indexOf(optionSelected[0]);
      }
    },
    toggle(isShowed: boolean) {
      this.navigationDrawer = isShowed
      this.temporalStore.setDrawer(this.navigationDrawer);
    }
  },
  watch: {
    '$route'() {
      this.updateSelectedOption();
    },
    'temporalStore.drawer': {
      immediate: true,
      handler(newValue) {
        this.navigationDrawer = newValue;
      }
    }
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
