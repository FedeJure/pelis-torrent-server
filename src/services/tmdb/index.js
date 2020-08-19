const {initService} = require('./service');
'use strict'
/**parameters allowed: name, category... */

const apiKey = "133f4d8b4fed128b27fa0bb407956c56";
module.exports = async function (fastify, opts) {
  initService(fastify, apiKey);
  fastify.get('/tmdb/search', async function (request, reply) {
    Promise.all([
      fastify.axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=${request.query.language}&page=1&include_adult=false&query=${request.query.query}`),
      fastify.axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=${request.query.language}&page=1&include_adult=false&query=${request.query.query}`)
    ])
    .then(res => reply.status(200).send({results: [].concat.apply([], res.map(r => r.data.results.map(contentToResponseDto))).sort(sortByRating)}))
    .catch(err => console.log(err) || reply.status(400).send(err));
  });

  fastify.get('/tmdb/movie', async function (request, reply) {
    fastify.axios.get(`https://api.themoviedb.org/3/movie/${request.query.movieId}?api_key=${apiKey}`)
    .then(res => reply.status(200).send(res.data))
    .catch(err => console.log(err) || reply.status(400).send(err));
  });

  fastify.get('/tmdb/languages', async function (request, reply) {
    fastify.axios.get(`https://api.themoviedb.org/3/configuration/languages?api_key=${apiKey}`)
    .then(res => reply.status(200).send(res.data))
    .catch(err => console.log(err) || reply.status(400).send(err));
  });

  
  fastify.get('/tmdb/trailer', async function (request, reply) {
    fastify.axios.get(`https://api.themoviedb.org/3/movie/${request.query.movieId}/videos?type=Trailer&api_key=${apiKey}&language=${request.query.language}`)
    .then(res => reply.status(200).send(res.data))
    .catch(err => console.log(err) || reply.status(400).send(err));
  });

  fastify.get('/tmdb/homeSeries', async function (request, reply) {
    fastify.axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&page=${request.query.page}`)
    .then(res => reply.status(200).send(res.data))
    .catch(err => console.log(err) || reply.status(400).send(err));
  });

  fastify.get('/tmdb/serie', async function (request, reply) {
    fastify.axios.get(`https://api.themoviedb.org/3/tv/${request.query.serieId}?api_key=${apiKey}`)
    .then(res => reply.status(200).send(res.data))
    .catch(err => console.log(err) || reply.status(400).send(err));
  });
}

const contentToResponseDto = content => {
  return content.first_air_date ? serieToResponseDto(content) : movieToResponseDto(content);
}

const serieToResponseDto = serie => ({
  title: serie.name,
  vote_average: serie.vote_average,
  release_date: serie.first_air_date,
  poster_path: serie.poster_path,
  id: serie.id,
  type: "serie"
})

const movieToResponseDto = movie => ({
  title: movie.title,
  vote_average: movie.vote_average,
  release_date: movie.release_date,
  poster_path: movie.poster_path,
  id: movie.id,
  type: "movie"
});

const sortByRating = (contentA, contentB) => {
  return contentB.vote_average - contentA.vote_average
}