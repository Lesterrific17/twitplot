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
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)/,
                loader: 'url-loader'
            },
            {
                test: /\.(jpg|svg|png)$/,
                loader: 'file-loader?name=images/[name].[ext]'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
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