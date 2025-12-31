import { defineConfig } from '@meteorjs/rspack';
import path from 'node:path';
import { createRequire } from 'node:module';
import postcssPresetEnv from 'postcss-preset-env';
import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { VuetifyLoaderPlugin } from 'vuetify-loader';

const projectRoot = process.cwd();
const require = createRequire(import.meta.url);
const vueLoaderPath = require.resolve('vue-loader');

export default defineConfig((Meteor) => {
	const isClient = Meteor.isClient;

	return {
		resolve: {
			extensions: ['.ts', '.js', '.vue', '.json'],
			alias: {
				'@root': path.resolve(projectRoot, './'),
				'@api': path.resolve(projectRoot, './imports/api'),
				'@middlewares': path.resolve(projectRoot, './imports/middlewares'),
				'@server': path.resolve(projectRoot, './imports/startup/server'),
				'@components': path.resolve(projectRoot, './imports/ui/components'),
				'@views': path.resolve(projectRoot, './imports/ui/views'),
				'@layouts': path.resolve(projectRoot, './imports/ui/layouts'),
				'@routes': path.resolve(projectRoot, './imports/ui/routes'),
				'@mixins': path.resolve(projectRoot, './imports/ui/mixins'),
				'@typings': path.resolve(projectRoot, './imports/ui/typings'),
			},
		},
		plugins: [
			...(isClient
				? [new VueLoaderPlugin(), new VuetifyLoaderPlugin({ autoImport: true })]
				: []),
			new TsCheckerRspackPlugin(),
		],
		module: {
			rules: [
				...(isClient
					? [
							{
								test: /\.vue$/,
								type: 'javascript/auto',
								use: [
									{
										loader: vueLoaderPath,
										options: {
											// Required for proper single-file component handling in Rspack
											experimentalInlineMatchResource: true,
										},
									},
								],
							},
					  ]
					: []),
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					loader: 'builtin:swc-loader',
				},
				{
					test: /\.css$/,
					type: 'css',
					use: [
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [postcssPresetEnv()],
								},
							},
						},
					],
				},
				{
					test: /\.s[ac]ss$/,
					type: 'css',
					use: [
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [postcssPresetEnv()],
								},
							},
						},
						'sass-loader',
					],
				},
			],
		},
	};
});
