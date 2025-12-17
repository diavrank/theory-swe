/// <reference types="./vite.config" />

import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { meteor } from 'meteor-vite/plugin';
import vue from '@vitejs/plugin-vue';

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify';

const loadSwcAliases = (fallback: Record<string, string> = {}) => {
    const swcrcPath = path.resolve(__dirname, '.swcrc');

    try {
        const swcrcContent = fs.readFileSync(swcrcPath, 'utf-8');
        const swcrc = JSON.parse(swcrcContent);
        const jsc = swcrc.jsc ?? {};
        const baseUrl = jsc.baseUrl ?? '.';
        const basePath = path.resolve(__dirname, baseUrl);
        const paths = jsc.paths ?? {};

        const swcAliases = Object.entries(paths)
            .filter(([key, values]) => key !== '*' && key !== '/*' && Array.isArray(values) && values.length > 0)
            .reduce<Record<string, string>>((aliases, [key, values]) => {
                const cleanedKey = key.replace(/\/\*$/, '');
                const cleanedTarget = values[0].replace(/\/\*$/, '');
                aliases[cleanedKey] = path.resolve(basePath, cleanedTarget);
                return aliases;
            }, {});

        return { ...fallback, ...swcAliases };
    } catch {
        return fallback;
    }
};

const aliasFallbacks = {
    '@api': path.resolve(__dirname, './imports/api'),
    '@server': path.resolve(__dirname, './imports/startup/server'),
    '@middlewares': path.resolve(__dirname, './imports/middlewares'),
    '@root': path.resolve(__dirname, './'),
    // UI aliases
    '@components': path.resolve(__dirname, './imports/ui/components'),
    '@views': path.resolve(__dirname, './imports/ui/views'),
    '@layouts': path.resolve(__dirname, './imports/ui/layouts'),
    '@routes': path.resolve(__dirname, './imports/ui/routes'),
    '@mixins': path.resolve(__dirname, './imports/ui/mixins'),
    '@typings': path.resolve(__dirname, './imports/ui/typings'),
};

const resolvedAliases = loadSwcAliases(aliasFallbacks);

export default defineConfig({
    resolve: {
        extensions: ['.ts', '.json', '.vue'],
        alias: resolvedAliases,
    },
    plugins: [
        meteor({
            clientEntry: 'imports/startup/client/index.ts',
            stubValidation: {
                ignorePackages: ['meteor/roles'],
            },
        }),
        vue(),
        vuetify({ autoImport: true }),
    ],

    optimizeDeps: {
        exclude: ['vue-meteor-tracker'],
    },
});
