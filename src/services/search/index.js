const searcher = require('./torrentSearcher.js');
const { getSerieAlternativeNames, getMovieAlternativeNames } = require("../tmdb/service");
const { getMovieTorrentsWithId } = require("../verifiedTorrents/service");

'use strict'

/**parameters allowed: name, category... */
module.exports = async function (fastify, opts) {
  fastify.get('/searchMovie', async function (request, reply) {
    const names = [request.query.name, ...(await getMovieAlternativeNames(request.query.movieId))];
    const rawTorrents = await Promise.all(names.map(name => searcher.searchMovie(escape(name))))
    const verifiedTorrents = await getMovieTorrentsWithId(request.query.movieId);
    const torrents = rawTorrents[0]
    reply.status(200).send({torrents, verifiedTorrents});
  });

  fastify.get('/searchSerie', async function (request, reply) {
    const season = (request.query.season < 10 ? "0"+ request.query.season : request.query.season).toString();
    const episode = (request.query.episode < 10 ? "0"+request.query.episode : request.query.episode).toString();
    const names = [request.query.name, ...(await getSerieAlternativeNames(request.query.serieId))];
    const rawTorrents = await Promise.all(names.map(name => searcher.searchSerie(escape(name), season)))
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
