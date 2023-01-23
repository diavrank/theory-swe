/// <reference types="./vite.config" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'
import path from 'path';

console.log('dirname: ',path.resolve(__dirname, 'middlewares'));

export default defineConfig({
  resolve:{
    extensions: [".ts", ".json", ".vue"],
    alias:{
      "@api": path.resolve(__dirname, './imports/api'),
      // UI aliases
      "@components": path.resolve(__dirname, './imports/ui/components'),
      "@views": path.resolve(__dirname, './imports/ui/views'),
      "@layouts": path.resolve(__dirname, './imports/ui/layouts'),
      "@routes": path.resolve(__dirname, './imports/ui/routes'),
      "@mixins": path.resolve(__dirname, './imports/ui/mixins'),
      "@typings": path.resolve(__dirname, './imports/ui/typings'),
    },
  },
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
