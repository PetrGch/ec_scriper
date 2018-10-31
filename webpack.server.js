const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './server/index.js',

  output: {
    path: path.resolve('server-build'),
    filename: 'scraperBundle.js'
  },

  target: 'node',

  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
};