'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const TorrentSearchApi = require('torrent-search-api');
const proxy = require('fastify-http-proxy');


module.exports = function (fastify, opts, next) {
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.torrent = TorrentSearchApi;
  fastify.torrent.enablePublicProviders();

  fastify.register(proxy, {
    upstream: 'https://api.themoviedb.org/3/search/movie',
    prefix: '/tmdb'
  });

  fastify.register(proxy, {
    upstream: 'https://yts.mx/api/v2/list_movies.json',
    prefix: '/yts'
  });

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
