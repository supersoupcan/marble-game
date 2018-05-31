const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'client', 'src', 'index.js'),
    output: {
      path: path.resolve(__dirname, 'client', 'static'),
      publicPath: 'src/static/',
      filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'client', 'src'),
        query : {
          presets : ['env']
        }
      }
    ]
  }
};
