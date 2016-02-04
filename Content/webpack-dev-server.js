/* eslint no-console: 0 */
import { Server } from 'hapi';
import H2o2 from 'h2o2';
import yargs from 'yargs';
import Webpack from 'webpack';
import WebpackPlugin from 'hapi-webpack-plugin';
import webpackConfig from './webpack.config';

const argv = yargs.argv;

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

if (!isNumeric(argv.port)) {
  console.log(`Port must be numeric`);
  process.exit(-1);
}

const compiler = new Webpack(webpackConfig);
const server = new Server();

server.connection({ host: 'localhost', port: 6789, labels: 'proxy-server' });

const assets = {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  noInfo: true,
  quiet: false,
  host: 'localhost',
  port: 6790,
  stats: {
    colors: true,
  },
};

const hot = {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000,
};

server.register([
  {
    register: H2o2,
  },
  {
    register: WebpackPlugin,
    options: { compiler, assets, hot },
  },
], error => {
  if (error) {
    return console.error(error);
  }

  server.route({
    method: ['GET', 'POST'],
    path: '/{path*}',
    handler: (request, reply) => {
      if (/^Content\/bundles\/[A-Za-z0-9\-]+\.css/.test(request.params.path)) {
        const response = reply('// This is a fake CSS content... :)');
        response.type('text/css');
        return response;
      }

      return reply.proxy({
        host: 'localhost',
        port: argv.port,
        passThrough: true,
      });
    },
  });

  server.start(() => console.log(`Server running on ${server.info.uri}`));
});
