const config = require('./webpack.config.prod')[0];
const { resolve } = require('path');

config.output.path = resolve(__dirname, 'public');
module.exports = config;
