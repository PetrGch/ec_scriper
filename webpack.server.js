const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require( 'nodemon-webpack-plugin' );

module.exports = {
  entry: './server/index.js',

  output: {
    path: path.resolve('server-build'),
    filename: 'index.js'
  },

  target: 'node',

  externals: [nodeExternals()],

  watch: true,

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },

  plugins: [
    // new NodemonPlugin({
    //   watch: path.resolve('./server/index.js'),
    //   verbose: true,
    // }),
  ],

};