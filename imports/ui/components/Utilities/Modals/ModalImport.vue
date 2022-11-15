<template>
  <v-dialog id="modalImport" max-width="500px" v-model="dialog">
    <v-card>
      <v-card-title class="headline">
        <div class="headline">
          Add {{ modalData.typeElement }}
        </div>
      </v-card-title>
      <v-card-text>
        <v-file-input :rules="modalData.rules" :accept="modalData.accept"
                      show-size :placeholder="'Selecciona tu '+modalData.typeElement"
                      v-model="file" :label="modalData.mainNameElement"
                      filled :prepend-icon="modalData.icon">
        </v-file-input>
        <div class="subtitle-1 orange--text">*{{ modalData.warning }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="default" text @click="cancel">
          Cancel
        </v-btn>
        <v-btn color="primary" outlined depressed @click="uploadFile">
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'ModalImport',
  props: ['modalData'],
  data() {
    return {
      file: null,
      fileData: {
        blob: null as string | ArrayBuffer | null,
        name: null
      },
      tempSrc: null as string | ArrayBuffer | null,
      dialog: false
    };
  },
  watch: {
    file(newFile) {
      if (newFile && typeof (FileReader) != 'undefined') {
        const reader = new FileReader();
        const reader2 = new FileReader();
        reader.onload = (ev) => {
          if (ev.target) {
            this.tempSrc = ev.target.result;
          }
        };
        reader.readAsDataURL(newFile);

        reader2.onload = (file) => {
          if (file.target) {
            this.fileData.blob = file.target.result;
            this.fileData.name = newFile.name;
          }
        };
        reader2.readAsBinaryString(newFile);

      }
    }
  },
  methods: {
    uploadFile() {
      this.dialog = false;
      this.$emit('uploadFile', this.fileData);
    },
    cancel() {
      this.dialog = false;
    }
  }
})
</script>

<style scoped>

</style>
