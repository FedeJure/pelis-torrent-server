'use strict'
/**parameters allowed: name, category... */
module.exports = async function (fastify, opts) {
  fastify.get('/tmdb/search', async function (request, reply) {
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=133f4d8b4fed128b27fa0bb407956c56&language=${request.query.language}&page=1&include_adult=false&query=${request.query.query}`)
    .then(res => reply.status(200).send(res))
    .catch(err => reply.status(400).send(err));
  });
}
