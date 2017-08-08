const path = require('path');
const config = require('../config/server.env');
const nodeExternals = require('webpack-node-externals');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  entry: {
    server: './src/server.js',
  },
  output: {
    path: config.server.assetsRoot,
    filename: '[name].js',
    publicPath: config.server.assetsPublicPath,
    libraryTarget: 'commonjs',
    library: '',
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': resolve('src'),
      server: resolve('src/server'),
      handlebars: 'handlebars/runtime.js',
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        exclude: ['node_modules'],
      },
    ],
  },
  target: 'node',
  watch: process.env.NODE_ENV !== 'production',
  bail: true,
};
