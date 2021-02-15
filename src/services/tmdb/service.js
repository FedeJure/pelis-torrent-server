var fastify;
var key;

var movieGenres = [];
var serieGenres = [];

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

const getMovieAlternativeNames = async movieId => {
    try {
        return (await fastify.axios.get(`https://api.themoviedb.org/3/movie/${movieId}/alternative_titles?&api_key=${key}`))
            .data.results.map(r => escape(r.title));
    } catch (error) {
        console.error(error)
        return [];
    }
}

const getExternalIdsOfSerie = async serieId => {
    return fastify.axios.get(`https://api.themoviedb.org/3/tv/${serieId}/external_ids?&api_key=${key}`)
};

const getMovieGenres = async () => {
    return new Promise(async (res, err) => {
        if (movieGenres.length > 0) {
            res(movieGenres);
            return;
        }
        movieGenres = (await fastify.axios.get(`https://api.themoviedb.org/3/genre/movie/list?&api_key=${key}`)).data.genres || [];
        res(movieGenres);
    });
}

const getSerieGenres = async () => {
    return new Promise(async (res, err) => {
        if (serieGenres.length > 0) {
            res(serieGenres);
            return;
        }
        serieGenres = (await fastify.axios.get(`https://api.themoviedb.org/3/genre/tv/list?&api_key=${key}`)).data.genres || [];
        res(serieGenres);
    });
}

exports.initService = init;
exports.getSerieAlternativeNames = getSerieAlternativeNames;
exports.getMovieAlternativeNames = getMovieAlternativeNames;
exports.getExternalIdsOfSerie = getExternalIdsOfSerie;
exports.getMovieGenres = getMovieGenres;
exports.getSerieGenres = getSerieGenres;