var webpack = require('webpack');
var IS_DEBUG = process.env.NODE_ENV !== 'production';

var webpackConfig = {
  entry: {
    main: [ './js/index.js' ],
    vendor: [
      // Styles
      'bootstrap/dist/css/bootstrap',
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
    extensions: ['', '.js', '.css']
  },
  module: {
    loaders: [
      { test: /\.css$/, loaders: ['style', 'css'] },
      { test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
    ]
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

module.exports = webpackConfig;
