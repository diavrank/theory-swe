import { defineConfig } from 'vitest/config';
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
    plugins: [
        // @ts-ignore
        vue(),
        // Vuetify Loader
        // https://github.com/vuetifyjs/vuetify-loader
        // @ts-ignore
        vuetify({ autoImport: true }),
    ],
    test: {
        globals: true,
        dir: './tests/client/',
        environment: 'happy-dom',
        coverage: {
            provider: 'istanbul', // or 'c8',
            all: true,
        },
        setupFiles: "vuetify.config.ts",
        deps: {
            inline: ["vuetify"],
        },
    },
    resolve: {
        alias: {
            '@views': path.resolve(__dirname, 'imports/ui/views'),
            'meteor/meteor': path.resolve(__dirname, 'tests/mocks/meteor'),
            '@typings': path.resolve(__dirname, 'imports/ui/typings'),
            '@mixins': path.resolve(__dirname, 'imports/ui/mixins'),
            '@routes': path.resolve(__dirname, 'imports/ui/routes'),
            '@layouts': path.resolve(__dirname, 'imports/ui/layouts'),
            '@components': path.resolve(__dirname, 'imports/ui/components')
        },
    },
});
