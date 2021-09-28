<template>
    <v-row>
        <v-col xs="12" sm="8" md="4" class="d-flex flex-column justify-center pa-12">
            <div class="text-center">
                <img src="/img/vuetify.png" alt="Vuetify" height="180px" width="auto"/>
            </div>
            <transition name="section-view">
                <router-view name="sectionView"/>
            </transition>
        </v-col>
        <v-col xs="12" sm="4" md="8" class="right-side d-flex flex-column justify-center">
            <div class="text-h2 font-weight-medium mr-10 text-right white--text">
              TheorySwe
            </div>
        </v-col>
    </v-row>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: "LytAuth",
    })
</script>

<style scoped lang="sass">
.text-h2
  z-index: 2
  margin-top: 300px

.right-side
  background-image: url('/img/meteor.jpg')
  background-size: cover
  color: var(--body-color)
  position: relative

.section-view-enter-active
  transition: all .5s ease .5s

.section-view-leave-active
  transition: all .5s ease

.section-view-enter, .section-view-leave-to
  opacity: 0

</style>
