const path = require('path');
const webpack = require('webpack');
const { lib_dir } = require('./config');

const mainConfig = {
  name: 'main',
  target: 'node',
  entry: path.join(__dirname, '../index.js'),
  output: {
    path: lib_dir,
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    publicPath: ''
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(jsx|e\.js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: path.join(__dirname, '../../build/cache')
            }
          }
        ]
      }
    ]
  }
}

module.exports = mainConfig