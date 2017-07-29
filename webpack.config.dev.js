const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./src/config');

module.exports = {
  target: 'web',
  context: resolve(__dirname, 'src'),
  entry: [
    'react-hot-loader/patch', // activate HMR for React
    'webpack-dev-server/client?http://localhost:8080', // bundle the client for webpack-dev-server and connect to the provided endpoint
    'webpack/hot/only-dev-server', // bundle the client for hot reloading only- means to only hot reload for successful updates
    './client/index.js' // the entry point of our app
  ],
  output: { filename: '[name]_[hash].js', path: resolve(__dirname, 'build', 'www'), publicPath: '/' },
  module: {
    rules: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(gif|png|jpe?g|svg|woff(2)?|eot|ttf)$/i, loader: 'file-loader?name=assets/[name]_[hash].[ext]' },
      { test: /\.?scss$/, use: ['style-loader', 'css-loader?modules&localIdentName=[name]_[local]_[hash:base64:5]', 'resolve-url-loader', { loader: 'sass-loader', options: { data: '@import "' + resolve(__dirname, 'src/app/style/base.scss') + '";' } }] },
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.____js$/, loader: 'eslint-loader', exclude: /node_modules/, options: { emitWarning: true } },
    ],
  },
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    contentBase: resolve(__dirname, 'src', 'www'),
    historyApiFallback: true,
    publicPath: '/',
    stats: { // Supresses the HUGE list of info on every hot reload
      colors: true,
      hash: false,
      version: false,
      timings: true,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: false
    }
  },
  resolve: { alias: { '~': resolve(__dirname, 'src', 'app') } },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { 'NODE_ENV': `"${process.env.NODE_ENV || 'development'}"` },
      CONFIG: JSON.stringify(config.getPublic())
    }),
    new HtmlWebpackPlugin({ template: resolve(__dirname, 'src', 'www', 'index.html') }), // adds css and bundle links to html document
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
  ]
};

console.log('----[ CONFIG ]--------------------------\n\n', config.get(), '\n\n----------------------------------------');
