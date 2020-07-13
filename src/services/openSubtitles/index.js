const OpenSubtitles = require("opensubtitles-api");

'use strict'
/**parameters allowed: name, category... */
module.exports = async function (fastify, opts) {
  const openSubtitles = new OpenSubtitles('UserAgent');
  fastify.get('/openSubtitles/search', async function (request, reply) {
    const subtitles = await openSubtitles.search({imdbid: request.query.imdbid, extensions: ['vtt']});
    reply.status(200).send(subtitles);
  });
}
