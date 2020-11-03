// path import for node
const path = require('path');

// requiring webpack for HMR
const webpack = require('webpack');


// environment config

const isDevelopment = process.env.NODE_ENV !== 'production';

// loaders here

const { VueLoaderPlugin } = require('vue-loader');

// plugins required for webpack
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/js/main.js',
    devServer: {
        // the content base is important here - needs to be set to src so that html changes as well as the vue app changes are hot reloaded
        contentBase: path.join(__dirname, 'src'),
        watchContentBase: true,
        compress: true,
        openPage: 'dist/',
        port: 3001,
        hot: true,
        watchOptions: {
            poll: true
        }
    },
    output: {
        filename: isDevelopment ? 'js/main.js' : 'js/main.[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: isDevelopment ? '/dist/' : '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // fallback to style-loader in development
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment
                        }
                    }
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: !isDevelopment }
                    }
                ]
            },
            {
                test: /\.ejs$/,
                loader: 'compile-ejs-loader',
                options: {
                    'htmlmin': true,
                    'htmlminOptions': {
                        removeComments: true
                    },
                },
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                  'file-loader',
                  {
                    loader: 'image-webpack-loader',
                    options: {
                        name: "[path]/[name].[ext]",
                        context: "src"
                    },
                  },
                ],
              }

        ]
    },
    resolve: {
        extensions: ['.js', '.scss']
    },
    plugins: [
        // clean of dist directory
        new CleanWebpackPlugin(),
        // hmr for webpack
        new webpack.HotModuleReplacementPlugin(),
        // vue loader for partial view content
        new VueLoaderPlugin(),
        // html for webpack as basic start
        new HtmlWebpackPlugin({
            template: './src/views/index.ejs',
            filename: './index.html',
            inject: true,
            hash: true,
        }),
        // css extraction
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        // copy images across to save having to load via require statements in src
        new CopyWebpackPlugin({
            patterns: [
                {from:'src/images',to:'images'} 
            ]
        })
    ]
};
