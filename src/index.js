'use strict'

const fastify = require('fastify')();
const path = require('path')
const AutoLoad = require('fastify-autoload')
const TorrentSearchApi = require('torrent-search-api');
const axios = require('axios');

const initialization = function (fastify, opts, next) {
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.torrent = TorrentSearchApi;
  fastify.torrent.enablePublicProviders();

  fastify.axios = axios;

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })

  // This loads all hooks defined in hooks
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'hooks'),
    options: Object.assign({}, opts)
  })

  next()
}

fastify.register(initialization);

fastify.listen(process.env.MY_PORT || process.env.PORT || 3001, '0.0.0.0', err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
});