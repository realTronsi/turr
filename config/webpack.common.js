'use strict';

const paths = require('./paths');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const plugins = [
  new CopyPlugin({
    patterns: [
      {from: './src/public/game/assets/', to: 'assets'},
    ],
  }),
   new HtmlWebpackPlugin({
      hash: true,
      title: 'turr',
      template: paths.src + '/index.html',
      filename: './index.html',
      favicon: "./src/public/favicon.png",
      minify: {
         removeComments: true,
         collapseWhitespace: true,
      },
   }),
   new CleanWebpackPlugin(),
   new WebpackBar(),
];
module.exports = {
   entry: [paths.src + '/index.js'],
   mode: 'development',
   devtool: 'source-map',
   output: {
      filename: '[name].[contenthash].js',
      path: paths.build,
      publicPath: '/',
   },
   module: {
      rules: [
         {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
         }
      ],
   },
   plugins,
};
