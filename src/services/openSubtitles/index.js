const OpenSubtitles = require("opensubtitles-api");
const { getExternalIdsOfSerie } = require('../tmdb/service');
const availableLanguages = ['en','es'];
'use strict'
/**parameters allowed: name, category... */
module.exports = async function (fastify, opts) {
  const openSubtitles = new OpenSubtitles({
    useragent:'UserAgent',
    username: 'fedejure1',
    password: 'fedejure11',
    ssl: true
  });
  var session = {logged: false};
  openSubtitles.api.LogIn('fedejure1', 'fedejure11', 'es', 'UserAgent')
    .then(res => {
        session.token = res.token;
        session.user = res.data;
    })
    .catch(err => {
        console.log(err);
    });

  fastify.get('/openSubtitles/search', async function (request, reply) {
    // const subtitles = await openSubtitles.search({imdbid: request.query.imdbid, sublanguageid: 'en,es'});
    const subtitles = await openSubtitles.api.SearchSubtitles(session.token,[
      {"imdbid": request.query.imdbid.slice(2,request.query.imdbid.length)},
    ]);
    response = {};

    if (subtitles.data && subtitles.data.filter)
      subtitles.data.forEach(sub => {
        if (!availableLanguages.includes(sub.ISO639)) return;
        if (!response[sub.SubLanguageID]) response[sub.SubLanguageID] = [toSubtitleObject(sub)];
        else response[sub.SubLanguageID].push(toSubtitleObject(sub));
      });
    reply.status(200).send(response);
  });

  fastify.get('/openSubtitles/search/serie', async function (request, reply) {
    const externalIds = await getExternalIdsOfSerie(request.query.serieId);
    if (!externalIds || !externalIds.data || !externalIds.data.imdb_id) {
      reply.status(400).send("Error finding subtitles")
      return;
    }
    const subtitles = await openSubtitles.search({
      season: request.query.season,
      episode: request.query.episode,
      imdbid: externalIds.data.imdb_id,
      extensions: ['srt', 'vtt']
    })
    reply.status(200).send(subtitles);
  });

  fastify.get('/openSubtitles/search/movie', async function (request, reply) {
    const subtitles = await openSubtitles.search({
      imdbid: request.query.imdbId,
      extensions: ['srt', 'vtt']
    })
    reply.status(200).send(subtitles);
  });
}

const toSubtitleObject = sub => {
  return ({
    score: sub.SubRating,
    url: getVttUrl(sub.SubDownloadLink),
    languageCode: sub.SubLanguageID,
    languageName: sub.LanguageName,
    imdbid: sub.IDMovieImdb
  });
}

const getVttUrl = url => {
  return url.replace("/filead", "/subformat-vtt/filead").replace(".gz", "");
}
