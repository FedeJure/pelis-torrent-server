const fuzzySet = require('fuzzyset.js');
const searcher = require('./torrentSearcher.js');
const { getSerieAlternativeNames } = require("../tmdb/service");

'use strict'

/**parameters allowed: name, category... */
module.exports = async function (fastify, opts) {
  fastify.get('/search', async function (request, reply) {
    const torrents = await fastify.torrent.search(request.query.name, 'Movies', 20);
    const torrentsMap = {};
    torrents.forEach(t => { torrentsMap[t.title] = t });
    const similSet = fuzzySet(torrents.map(t => t.title));

    const response = similSet.get(request.query.name, [], 0.1).slice(0,10).map(t => torrentsMap[t[1]]);

    const magnets = await Promise.all(response.map(torrent => fastify.torrent.getMagnet(torrent)));
    // const responseWithMagnet = await Promise.all(response.map(torrent => ({...torrent, magnet: fastify.torrent.getMagnet(torrent)})));

    for (let index = 0; index < response.length; index++) {
      response[index].magnet = magnets[index];
    }
    reply.status(200).send({response});
  });

  fastify.get('/searchSerie', async function (request, reply) {
    const season = (request.query.season < 10 ? "0"+ request.query.season : request.query.season).toString();
    const episode = (request.query.episode < 10 ? "0"+request.query.episode : request.query.episode).toString();
    const names = await getSerieAlternativeNames(request.query.serieId);
    const rawTorrents = await Promise.all(names.map(name => searcher.search(escape(name), season)))
    const torrents = [].concat.apply([], rawTorrents)
    const response = {
      completeSeason: [],
      episode: []
    }

    torrents.forEach(tor => {
      if (!tor.title) return;
      const title = tor.title.toLocaleLowerCase();
      const isSeason = title.includes(`season ${request.query.season}`) || title.includes(`s${season}`)
      const isEpisode = title.includes(`episode ${request.query.episode}`) || title.includes(`e${episode}`) || title.includes(`ep${episode}`)

      if (isSeason && isEpisode) {
        response.episode.push(tor)
      }
      if (isSeason && !isEpisode) {
        response.completeSeason.push(tor);
      }
    });
    reply.status(200).send({torrents: response});
  });
}
