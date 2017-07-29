const { resolve } = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./src/config');

const vendorList = [ // Add libraries here to split them out into the vendor bundle
  'react',
  'react-dom',
  'react-router',
  'react-redux',
  'immutable',
  'redux-immutable',
  'redux',
  'js-cookie',
  'babel-polyfill',
  'isomorphic-fetch'
];

const clientConfig = {
  target: 'web',
  context: resolve(__dirname, 'src'),
  entry: { bundle: ['./client/index.js'], vendor: vendorList },
  output: { filename: '[name]_[chunkhash].js', path: resolve(__dirname, 'build', 'www'), publicPath: '/' },
  module: {
    rules: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(gif|png|jpe?g|svg)$/i, loader: 'file-loader?name=assets/[name]_[hash].[ext]' },
      { test: /\.?scss$/, use: ExtractTextPlugin.extract({ use: ['css-loader?modules&minimize', 'resolve-url-loader', { loader: 'sass-loader', options: { data: `@import "${resolve(__dirname, 'src/app/style/base.scss')}";` } }] }) },
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
    ],
  },
  resolve: { alias: { '~': resolve(__dirname, 'src', 'app') } },
  plugins: [
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: `"${process.env.NODE_ENV || 'development'}"` }, CONFIG: JSON.stringify(config.getPublic()) }),
    new webpack.optimize.CommonsChunkPlugin('vendor'), // Splits vendor and application code
    new ExtractTextPlugin('style_[contenthash].css'),
    new HtmlWebpackPlugin({ template: resolve(__dirname, 'src', 'www', 'index.html') }), // Adds css and bundle links to html document
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, output: { comments: false } }),
  ],
};

// Loop through all node modules and skip including them
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => { nodeModules[mod] = `commonjs ${mod}`; return 0; });

const serverConfig = {
  target: 'node',
  node: { __dirname: false, __filename: false },
  context: clientConfig.context,
  entry: { bundle: './server/index.js' },
  output: { filename: 'index.js', path: resolve(__dirname, 'build', 'server') },
  module: {
    rules: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(gif|png|jpe?g|svg)$/i, loader: 'file-loader?name=assets/[name]_[hash].[ext]' },
      { test: /\.?scss$/, use: ['css-loader/locals?modules', 'resolve-url-loader', { loader: 'sass-loader', options: { data: `@import "${resolve(__dirname, 'src/app/style/base.scss')}";` } }] },
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
    ],
  },
  externals: nodeModules,
  resolve: clientConfig.resolve,
  plugins: [new webpack.DefinePlugin({ 'process.env': { NODE_ENV: `"${process.env.NODE_ENV || 'development'}"` }, CONFIG: JSON.stringify(config.getPublic()), CONFIG_SERVER: JSON.stringify(config.get()) })],
};

console.log('----[ CONFIG ]--------------------------\n\n', config.get(), '\n\n----------------------------------------');

module.exports = [clientConfig, serverConfig];
