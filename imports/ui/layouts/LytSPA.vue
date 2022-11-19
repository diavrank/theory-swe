<template>
  <v-container fluid>
    <header-view></header-view>
    <navigation-drawer></navigation-drawer>
    <transition appear name="appear-section-spa">
      <v-main id="main_section">
        <router-view class="section-view" name="sectionView" v-slot="{Component}" v-if="loggedUser">
          <transition name="section-view">
            <component :is="Component"/>
          </transition>
        </router-view>
      </v-main>
    </transition>
  </v-container>
</template>

<script lang="ts">
import HeaderView from './shared/HeaderView.vue';
import FooterView from './shared/FooterView.vue';
import NavigationDrawer from './shared/NavigationDrawer.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LytSPA',
  components: {
    NavigationDrawer,
    HeaderView,
    FooterView
  },
  data: () => ({
    loggedUser: false
  }),
  watch: {
    '$subReady.roles'(newValue) {
      if (newValue) {
        this.loggedUser = true;
      }
    }
  },
  meteor: {
    $subscribe: {
      roles: []
    }
  }
});
</script>

<style scoped lang="sass">
#main_section
  margin-bottom: 80px
  position: relative
  .section-view
    position: relative
    z-index: 2

.bottom-arc
  overflow: hidden
  position: fixed
  bottom: 0
  right: 0
  height: 140px
  z-index: 1
  img
    transform: rotate(-226deg) translateX(12px) translateY(-35px)
    height: 100px

.bg_lines
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  z-index: 0

.router-content
  position: relative
  z-index: 2

.section-view-enter-active, .section-view-leave-active
  transition: all .5s ease
  position: absolute
  width: 100%

.section-view-enter
  opacity: 0
  transform: translateX(100vw)

.section-view-enter-to
  margin-left: calc(50% - 570px)

.section-view-leave-to
  opacity: 0
  transform: translateX(-100vw)

.appear-header-enter-active
  transition: all .5s ease .5s

.appear-header-enter
  transform: translateY(-100px)
  opacity: 0

.appear-section-spa-enter-active
  transition: all .5s ease .5s

.appear-section-spa-enter
  opacity: 0
  transform: translateX(100vw)

</style>
