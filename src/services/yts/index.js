'use strict'
/**parameters allowed: name, category... */
module.exports = async function (fastify, opts) {
  fastify.get('/yts/homeMovies', async function (request, reply) {
    fastify.axios.get(`https://yts.mx/api/v2/list_movies.json?limit=${request.query.limit}&page=${request.query.page}&sort_by=year&minimum_rating=1`)
    .then(res => reply.status(200).send(res.data))
    .catch(err => reply.status(400).send(err));
  });
}