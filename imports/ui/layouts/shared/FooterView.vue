<template>
  <v-footer padless>
    <div class="d-flex flex-column align-center justify-center">
      <p class="white--text text-caption">
        ©{{ currentLocalDate().getFullYear() }} By Diavrank.
      </p>
    </div>
  </v-footer>
</template>

<script lang="ts">
import dateMixin from './../../mixins/helpers/date';
import Vue, { VueConstructor } from 'vue';

export default (Vue as VueConstructor<Vue &
    InstanceType<typeof dateMixin>
    >).extend({
  name: "FooterView",
  mixins: [dateMixin]
})
</script>

<style scoped lang="sass">
footer
  position: absolute
  bottom: 0
  left: 0
  width: 100%
  padding: 24px
  color: #6f6f6f
  background-color: transparent !important
  > div
    width: 100%

p.text-caption
  color: #6f6f6f
</style>
