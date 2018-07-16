process.traceDeprecation = true
const path = require('path')
const webpack = require('webpack')
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('extract-css-chunks-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
    mode: process.env.NODE_ENV == 'production' ? 'production' : 'development',
	entry: {
        app: './src/js/app.js',
    },
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, './dist/assets'),
		publicPath: '/assets',
	},
    devServer: {
        index: path.resolve(__dirname, './dist/index.html'),
        contentBase: path.resolve(__dirname, './dist'),
        inline: true,
        overlay: true,
        hot: true,
        host: '0.0.0.0',
        port: 5001,
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
                '@': path.resolve(__dirname, '.')
        }
    },
    performance: {
        hints: false
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
	module: {
		rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: [ 
                    'vue-style-loader',
                    process.env.NODE_ENV == 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    { 
                        loader:'postcss-loader',
                        options: {
                            config: {
                                path: path.resolve(__dirname, './postcss.config.js')
                            }
                        }
                    },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    useRelativePath: false,
                    emitFile: false //Prevents files from moving since they're correctly referenced
                }
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'assets/js'),
                    path.resolve(__dirname, 'node_modules/foundation-sites/js')
                ],
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
		],
	},
	plugins: [
        new CopyWebpackPlugin([
            { from: 'src/images/', to: 'images/' },
            { from: 'src/fonts/', to: 'fonts/' },
        ], { copyUnmodified: true }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
			filename: 'css/[name].css',
			publicPath: '/assets',
            hot: process.env.NODE_ENV == 'production' ? false : true
		}),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, './dist/index.html'),
            template: path.resolve(__dirname, './index.html'),
            alwaysWriteToDisk: true,
            inject: true,
            minify: true,
            hash: true,
            excludeChunks: []
        }),
        // writes index.html to force asset injection
        new HtmlWebpackHarddiskPlugin(),
        // writes assets to dist when watching to allow external access
        new WriteFileWebpackPlugin({
            force: true,
            test: /^(?!.*(hot)).*/,
        }),
		new WebpackBuildNotifierPlugin({
			sound: 'Funk',
			successSound: 'Pop'
		}),
	],
	devtool: 'source-map'
};

if (process.env.NODE_ENV === 'production') {
	config.plugins.push(
        new CleanWebpackPlugin(['dist']),
		new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
		new OptimizeCssAssetsPlugin()
	)
}

module.exports = config
