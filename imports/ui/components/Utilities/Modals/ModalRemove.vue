<template>
  <v-dialog id="modalRemove" max-width="500px" v-model="dialog">
    <v-card>
      <v-card-title class="headline">
        <div class="title">
          Remove {{ modalData.typeElement }}
        </div>
      </v-card-title>
      <v-card-text>
        Are you sure to remove {{ modalData.preposition }}
        {{ modalData.typeElement }} {{ modalData.mainNameElement }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="default" text v-on:click="cancel">
          Cancel
        </v-btn>
        <v-btn color="error" depressed v-on:click="removeElement">
          Remove
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import { ModalData } from '/imports/ui/typings/utilities.ts';

export default Vue.extend({
  name: 'ModalRemove',
  props: {
    modalData: {
      type: Object as PropType<ModalData>,
      required: true
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    removeElement() {
      this.modalData.element.removed = true;
      this.$emit('id_element', this.modalData._id);
      this.dialog = false;
    },
    cancel() {
      this.dialog = false;
    }
  }
});
</script>

<style scoped>

</style>
