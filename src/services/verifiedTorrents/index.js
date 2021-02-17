const { TorrentRepository, MovieTorrent, SerieTorrent } = require("../../repositories/torrents");


module.exports = async function (fastify, opts) {

    const torrentsRepository = new TorrentRepository();

    fastify.get('/verifiedTorrents/movie', async function (request, reply) {
        const {movieId} = request.query;
        torrentsRepository.getMovie(movieId).then(results => {
            reply.status(200).send(results);
        },
        err => {
            reply.status(501).send(err);
        })
    });

    fastify.get('/verifiedTorrents/serie', async function (request, reply) {
        const {serieId} = request.query;
        torrentsRepository.getSerie(serieId).then(results => {
            reply.status(200).send(results);
        },
        err => {
            reply.status(501).send(err);
        })
    });

    fastify.post('/verifiedTorrents/movie', async function (request, reply) {
        const {id, name, hash} = request.body;
        const torrent = new MovieTorrent(id,name,hash);
        torrentsRepository.saveMovie(torrent).then(result => {
            reply.status(200).send(result);
        },
        err => {
            reply.status(501).send(err);
        })
    });

    fastify.post('/verifiedTorrents/serie', async function (request, reply) {
        const {id, name, season, hash} = request.body;
        const torrent = new SerieTorrent(id,name,hash,season);
        torrentsRepository.saveMovie(torrent).then(result => {
            reply.status(200).send(result);
        },
        err => {
            reply.status(501).send(err);
        })
    });

  }
  