<template>
  <v-dialog v-model="loader"
            hide-overlay
            persistent
            width="300">
    <v-card color="primary">
      <v-card-text>
        {{ progressLabel }}
        <v-progress-linear indeterminate color="white" class="mb-0">
        </v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';

export interface LoaderType {
  activate(progressLabel: string): void;
  deactivate(): void;
}

export default defineComponent({
  name: 'Loader',
  data() {
    return {
      loader: false,
      progressLabel: ''
    };
  },
  mounted() {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
      currentInstance.appContext.config.globalProperties.$loader = this;
    }
  },
  methods: {
    activate(progressLabel = 'Loading...') {
      this.loader = true;
      this.progressLabel = progressLabel;
    },
    deactivate() {
      this.loader = false;
    }
  }
});
</script>

<style scoped>

</style>
