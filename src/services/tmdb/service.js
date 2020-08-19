var fastify;
var key;

const init = (fastifyInstance, apiKey) => {
    fastify = fastifyInstance;
    key = apiKey;
}

const getSerieAlternativeNames = async serieId => {
    try {
        return (await fastify.axios.get(`https://api.themoviedb.org/3/tv/${serieId}/alternative_titles?&api_key=${key}`))
            .data.results.map(r => escape(r.title));
    } catch (error) {
        console.error(error)
        return [];
    }
}
exports.initService = init;
exports.getSerieAlternativeNames = getSerieAlternativeNames;