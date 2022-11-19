<template>
  <v-snackbar
      v-model="snackbar"
      :color="color"
      :multi-line="mode === 'multi-line'"
      :location="location"
      :timeout="timeout"
      :rounded="rounded"
      :vertical="mode === 'vertical'">

    <template v-slot:actions>
      <v-tooltip location="bottom">
        <template v-slot:activator="{props}">
          <v-btn icon size="x-small" v-bind="props" @click="snackbar=false">
            <v-icon size="small">close</v-icon>
          </v-btn>
        </template>
        <span>Close</span>
      </v-tooltip>
    </template>
    <v-row>
      <v-col cols="12" md="1">
        <v-icon v-if="icon" theme="dark" start>
          cancel
        </v-icon>
      </v-col>
      <v-col cols="12" md="11">
        <div class="text-subtitle-1 pb-2">{{ title }}</div>

        <p>{{ text }}</p>
      </v-col>
    </v-row>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';

export default defineComponent({
  name: 'AlertMessage',
  data() {
    return {
      color: '',
      mode: '',
      snackbar: false,
      title: '',
      text: '',
      timeout: 6000,
      icon: '',
      location: 'bottom',
      variant: 'outlined',
      rounded: 'pill',
    };
  },
  mounted() {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
      currentInstance.appContext.config.globalProperties.$alert = this;
    }
  },
  methods: {
    /**
     * Show the alert with main configuration options
     * @param color Alert's color: success, error, info, primary, secondary, etc.
     * @param title Alert title
     */
    showAlertSimple(color: string, title: string): void {
      this.color = color;
      this.title = title;
      this.location = 'bottom';
      if (color === 'success') {
        this.icon = 'check_circle';
      } else if (color === 'error') {
        this.icon = 'close';
      } else if (color === 'info') {
        this.icon = 'info';
      } else if (color === 'warning') {
        this.icon = 'warning';
      }
      this.text = '';
      this.mode = '';
      this.timeout = 6000;
      this.snackbar = true;
    },
    /**
     * Show the alert with all configuration options
     * @param icon Alert's icon
     * @param color Alert's color: success, error, info, primary, secondary, etc.
     * @param text Alert text
     * @param mode : vertical, multi-line or empty string ''
     * @param timeout: timeout to disappear the alert, User 0 to keep open indefinitely
     * @param location : position of the alert, left, right or empty string '' for center
     * @param title
     */
    showAlertFull(icon: string,
                  color: string,
                  title: string,
                  mode: string,
                  timeout: number,
                  location: string,
                  text = ''): void {
      this.icon = icon;
      this.color = color;
      this.text = text;
      this.mode = mode;
      this.timeout = timeout;
      this.location = location;
      this.snackbar = true;
      this.title = title;
    },
    closeAlert(): void {
      this.snackbar = false;
    }
  }
});
</script>

<style>

</style>
