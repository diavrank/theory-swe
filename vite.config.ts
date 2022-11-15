/// <reference types="./vite.config" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],

  optimizeDeps: {
    exclude: [
      'vue-meteor-tracker',
    ],
  },

  meteor: {
    clientEntry: 'imports/startup/client/index.ts',
  },
})
