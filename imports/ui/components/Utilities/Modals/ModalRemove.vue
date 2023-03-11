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
        <v-btn color="default" variant="text" v-on:click="cancel">
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
import { defineComponent, PropType, ref } from 'vue';
import { ModalData } from '@typings/utilities';

export default defineComponent({
  name: 'ModalRemove',
  props: {
    modalData: {
      type: Object as PropType<ModalData>,
      required: true
    }
  },
  setup(props, context) {
    const dialog = ref(false);

    const removeElement = () => {
      props.modalData.element.removed = true;
      context.emit('id_element', props.modalData._id);
      dialog.value = false;
    };

    const cancel = () => {
      dialog.value = false;
    }

    return { cancel, removeElement, modalData: props.modalData, dialog };
  }
});
</script>

