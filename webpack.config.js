const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    devtool: 'cheap-module-source-map',

    entry: './app/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
                loader: 'url-loader'
            },
            {
                test: /\.html$/,
                loader: `ngtemplate-loader`,
                exclude: [
                  path.resolve(__dirname, 'app/index.html')
                ]
            },
            {
                test: /\.html$/,
                loader: `html-loader`
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['env']
                }
              }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'app', 'index.html'),
            inject: 'head'
        }),
        new webpack.DefinePlugin({
            TWITTER_API: JSON.stringify('/1.1/search/tweets.json')
        })
    ]

};
