//author @huntbao
var path = require('path');
module.exports = {
  entry: './dev/app.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      },
      {
        test: /\.styl$/,
        exclude: /(node_modules)/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.png$/,
        exclude: /(node_modules)/,
        loader: "url-loader?limit=100000"
      }
    ]
  },
  externals: {
    'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}

