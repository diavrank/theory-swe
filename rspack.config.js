const { defineConfig } = require('@meteorjs/rspack');
const { VueLoaderPlugin } = require('vue-loader');
const { rspack } = require('@rspack/core');
const path = require('path');

const projectRoot = process.cwd();
/**
 * Rspack configuration for Meteor projects.
 *
 * Provides typed flags on the `Meteor` object, such as:
 * - `Meteor.isClient` / `Meteor.isServer`
 * - `Meteor.isDevelopment` / `Meteor.isProduction`
 * - …and other flags available
 *
 * Use these flags to adjust your build settings based on environment.
 */
module.exports = defineConfig(Meteor => {
	const isTestRun = Boolean(
		Meteor.isTest ||
		Meteor.isTestLike ||
		Meteor.isTestFullApp ||
		process.env.TEST_WATCH ||
		process.env.METEOR_TEST
	);
	const shouldStubAppServer = Meteor.isServer && !Meteor.isTest && isTestRun;

	if (Meteor.isServer) {
		return {
			plugins: [],
			ignoreWarnings: [
				{
					module: /node_modules\/express\/lib\/view\.js/,
					message: /Critical dependency: the request of a dependency is an expression/,
				},
				{
					module: /node_modules\/routing-controllers\/.*importClassesFromDirectories\.js/,
					message: /Critical dependency: the request of a dependency is an expression/,
				},
				{
					module: /node_modules\/handlebars\/lib\/index\.js/,
					message: /require\.extensions is not supported by Rspack/,
				},
				{
					module: /node_modules\/hash-stream-validation\/index\.js/,
					message: /fast-crc32c/,
				},
				{
					module: /node_modules\/retry-request\/index\.js/,
					message: /Can't resolve 'request'/,
				},
			],
			module: {
				rules: [
					{
						test: /\.(ts)$/,
						exclude: /node_modules/,
						loader: 'builtin:swc-loader',
						options: {
							// Merge the configuration from swc.config.js with specific options
							jsc: {
								//...swcConfig.jsc,
								// Ensure baseUrl is an absolute path (SWC requires an absolute path)
								baseUrl: projectRoot,
								parser: {
									syntax: 'typescript',
									decorators: true,
								},
								transform: {
									legacyDecorator: true,
									decoratorMetadata: true,
								},
							},
						},
					},
				],
			},
			resolve: {
				extensions: ['.ts', '.json'],
				alias: {
					'@api': '/imports/api',
					'@server': '/imports/startup/server',
					...(shouldStubAppServer
						? { '/imports/startup/server': path.resolve(projectRoot, 'imports/startup/server/test-noop.ts') }
						: {}),
				},
				// Improve module resolution stability
				symlinks: true,
				fullySpecified: false,
			},
		}
	}

	return {
		...Meteor.isClient && {
			plugins: [new VueLoaderPlugin(),
			new rspack.DefinePlugin({
				__VUE_OPTIONS_API__: JSON.stringify(true),
				__VUE_PROD_DEVTOOLS__: JSON.stringify(false),
				__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
			})],
			module: {
				rules: [
					{
						test: /\.vue$/,
						loader: 'vue-loader',
						options: {
							// Note, for the majority of features to be available, make sure this option is `true`
							experimentalInlineMatchResource: true,
						},
					},
					{
						resourceQuery: /lang=sass/,
						type: 'css/auto',
						use: [
							{
								loader: 'sass-loader',
								options: {
									// using `modern-compiler` and `sass-embedded` together significantly improve build performance,
									// requires `sass-loader >= 14.2.1`
									api: 'modern-compiler',
									implementation: require.resolve('sass-embedded'),
									sassOptions: {
										syntax: 'indented',
									},
								},
							},
						],
					},
					{
						test: /\.sass$/,
						type: 'css/auto',
						use: [
							{
								loader: 'sass-loader',
								options: {
									// using `modern-compiler` and `sass-embedded` together significantly improve build performance,
									// requires `sass-loader >= 14.2.1`
									api: 'modern-compiler',
									implementation: require.resolve('sass-embedded'),
									sassOptions: {
										syntax: 'indented',
									},
								},
							},
						],
					},
					{ test: /\.css$/, type: 'css' },
					{
						test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
						type: 'asset/resource',
						generator: { filename: 'assets/images/[name].[hash][ext]' },
					},
					{
						test: /\.(ts)$/,
						exclude: /node_modules/,
						loader: 'builtin:swc-loader',
						options: {
							// Merge the configuration from swc.config.js with specific options
							jsc: {
								//...swcConfig.jsc,
								// Ensure baseUrl is an absolute path (SWC requires an absolute path)
								baseUrl: projectRoot,
								parser: {
									syntax: 'typescript',
									decorators: true,
								},
								//target: 'es2020',
								transform: {
									legacyDecorator: true,
									decoratorMetadata: true,
								},
							},
						},
					},
				],
			},
			resolve: {
				extensions: ['.ts', '.vue', '.json'],
				alias: {
					'@components': '/imports/ui/components',
					'@views': '/imports/ui/views',
					'@layouts': '/imports/ui/layouts',
					'@routes': '/imports/ui/routes',
					'@mixins': '/imports/ui/mixins',
					'@typings': '/imports/ui/typings',
				},
				// Improve module resolution stability
				symlinks: true,
				fullySpecified: false,
			},
		},
	};
});
