import { defineConfig } from '@meteorjs/rspack';
import rspack from '@rspack/core';
import { VueLoaderPlugin } from 'vue-loader';

// Get the absolute path of the project directory
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
//const projectRoot = resolve(__dirname);
const projectRoot = process.cwd();
//const vueLoaderPath = require.resolve('vue-loader');

console.log('projectRoot: ', projectRoot)

export default defineConfig((Meteor) => {
	return {
		experiments: {
			css: true,
			cache: false,
		},
		lazyCompilation: {
			entries: false,
			imports: false,
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
			alias: {
				'@api': '/imports/api',
				'@server': '/imports/startup/server',
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
		cache: false,
		// Add stats configuration for better error reporting
		stats: {
			errorDetails: true,
			children: true,
		},
		// Split vendor chunk (client-only to avoid server build conflicts)
		...(Meteor.isClient && !Meteor.isTest ? Meteor.splitVendorChunk() : {}),
		// Disable cache
		...Meteor.setCache(false),
		...(Meteor.isClient && {
			plugins: [
				new VueLoaderPlugin(),
				new rspack.DefinePlugin({
					__VUE_OPTIONS_API__: JSON.stringify(true),
					__VUE_PROD_DEVTOOLS__: JSON.stringify(false),
					__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
				}),
			],
		}),
		module: {
			rules: [
				// Client-only loaders
				...(Meteor.isClient
					? [
						{
							test: /\.vue$/,
							type: 'javascript/auto',
							use: [
								{
									loader: 'vue-loader',
									options: {
										// Required for proper single-file component handling in Rspack
										experimentalInlineMatchResource: true,
									},
								},
							],
						},
						{ test: /\.scss$/, type: 'css/auto' },
						{ test: /\.css$/, type: 'css' },
						{
							test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
							type: 'asset/resource',
							generator: { filename: 'assets/images/[name].[hash][ext]' },
						},
					]
					: []),
				// TypeScript support (both client and server)
				{
					test: /\.(ts|tsx)$/,
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
							target: 'es2020',
							transform: {
								legacyDecorator: true,
								decoratorMetadata: true,
							},
						},
					},
				},
			],
		},
	};
});
