var webpack = require('webpack');
var extractTextPlugin = require('extract-text-webpack-plugin');
var clean = require('clean-webpack-plugin');
var webpackStrip = require('strip-loader');
var path = require('path');
var IS_DEBUG = process.env.NODE_ENV !== 'production';

var webpackConfig = {
  entry: {
    home: [
      './src/entries/home',
      './src/styles/entries/home'
    ],
    vendor: [
      // Styles
      'bootstrap/dist/css/bootstrap',
      'font-awesome/css/font-awesome',
      './src/styles/core',
      // Scripts
      'bootstrap',
      'jquery'
    ],
  },
  output: {
    path: __dirname + '/bundles',
    filename: '[name].js',
    publicPath: '/Content/bundles/'
  },
  resolve: {
    extensions: ['', '.js', '.css', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        cacheable: true,
        query: {
          presets: ['es2015'],
          retainLines: true,
          cacheDirectory: true
        }
      },
      { test: /\.js$/, loader: 'eslint-loader', exclude: /(node_modules|bower_components)/ },
      { test: /\.css$/, loaders: ['style', 'css'] },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
      { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  sassLoader: {
    includePaths: ['./src/styles'],
  },
  devtool: IS_DEBUG ? 'cheap-source-map' : 'source-map',
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin(
      'vendor', '[name].js'
    )
  ]
};

if (IS_DEBUG) {
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );

  Object.keys(webpackConfig.entry).forEach(function(item) {
    if (item === 'vendor') {
      webpackConfig.entry[item].unshift('webpack/hot/dev-server');
    } else {
      webpackConfig.entry[item].unshift('webpack-hot-middleware/client');
    }
  });
}

// Production
if (!IS_DEBUG) {
  webpackConfig.plugins.push(
    new clean(['bundles']),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new extractTextPlugin("[name].css")
  );

  webpackConfig.module.loaders.forEach(function(item) {
    if (item.test.test('.scss')) {
      delete item.loaders;
      item.loader = extractTextPlugin.extract('css!sass');
    }

    if (item.test.test('.css')) {
      delete item.loaders;
      item.loader = extractTextPlugin.extract('css')
    }
  });

  webpackConfig.module.loaders.unshift(
    { test: /\.js$/, loader: webpackStrip.loader('debug', 'console.log') }
  );
}

module.exports = webpackConfig;
