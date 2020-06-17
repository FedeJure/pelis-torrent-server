const fuzzySet = require('fuzzyset.js');
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
  })
}
