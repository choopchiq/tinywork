var path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const BitBarWebpackProgressPlugin = require("bitbar-webpack-progress-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const NAME_BUILD = 'build';
const DIR_BUILD = path.resolve(__dirname, NAME_BUILD);
const DIR_APP = path.resolve(__dirname, 'client');

const extractSCSS = new ExtractTextPlugin('app.css');
const extractFont = new ExtractTextPlugin('font.css');

const isDevServer = process.argv[1].indexOf('webpack-dev-server') !== -1;

module.exports = {
    entry: {
        'vendor': ['react', 'react-dom', 'react-router-dom', 'es6-promise', 'whatwg-fetch', 'history/createBrowserHistory'],
        'app': path.resolve(DIR_APP, 'index.jsx')
    },
    devtool: 'source-map',
    cache: true,
    module: {
        rules: [{
            test: /\.scss$/,
            loader: extractSCSS.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader'
                },
                {
                    loader: 'postcss-loader'
                },
                {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [
                            path.resolve(DIR_APP, "themes")
                        ],
                        sourceMap: true
                    }
                }
                ]
            }),
            include: DIR_APP
        }, {
            test: /\.font\.js$/,
            loader: extractFont.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader'
                },
                {
                    loader: 'fontgen-loader',
                    options: {
                        embed: true,
                        types: 'woff'
                    }
                }
                ]
            }),
            include: DIR_APP
        }, {
            test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
            loader: 'file-loader',
            include: DIR_APP
        }, {
            test: /\.jsx$/,
            include: DIR_APP,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'react']
            }
        }, {
            test: /\.js$/,
            include: DIR_APP,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    target: "web",
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['vendor', 'app'],
            template: path.resolve(DIR_APP, 'index.html'),
            filename: 'index.html'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.js",
            minChunks: Infinity
        }),
        extractSCSS,
        extractFont,
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new CopyWebpackPlugin([
            { from: 'assets' }
        ]),
        new BitBarWebpackProgressPlugin()
    ],
    output: {
        path: DIR_BUILD,
        filename: '[name].js',
    },
    resolve: {
        alias: {
            'controls': path.resolve(DIR_APP, 'controls'),
            'services': path.resolve(DIR_APP, 'services'),
            'themes': path.resolve(DIR_APP, 'themes'),
            'modules': path.resolve(DIR_APP, 'modules'),
            'models': path.resolve(DIR_APP, 'models'),
            'views': path.resolve(DIR_APP, 'views')
        }
    },
    context: __dirname,

    devServer: {
        contentBase: "/" + NAME_BUILD,
        compress: false,
        port: 9000
    }
};