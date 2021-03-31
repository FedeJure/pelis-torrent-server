const { TorrentRepository, MovieTorrent, SerieTorrent } = require("../../repositories/torrents");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

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
        const { token } = request.query;
        try {
            jwt.verify(token,  process.env.TOKEN_SECRET)            
        } catch (error) {
            reply.status(501).send({ok: false, error: "Unauthorized"});
            return;
        }
        const {id, name, hash, audioType, subtitlesType} = request.body;
        const torrent = new MovieTorrent(id,name,hash, audioType, subtitlesType);
        torrentsRepository.saveMovie(torrent).then(result => {
            reply.status(200).send(result);
        },
        err => {
            reply.status(501).send(err);
        })
    });

    fastify.post('/verifiedTorrents/serie', async function (request, reply) {
        try {
            jwt.verify(token,  process.env.TOKEN_SECRET)            
        } catch (error) {
            reply.status(501).send({ok: false, error: "Unauthorized"});
            return;
        }
        const {id, name, season, hash, audioType, subtitlesType} = request.body;
        const torrent = new SerieTorrent(id,name,hash,season, audioType, subtitlesType);
        torrentsRepository.saveMovie(torrent).then(result => {
            reply.status(200).send(result);
        },
        err => {
            reply.status(501).send(err);
        })
    });

    fastify.get("/verifiedTorrents/login", async function(request, reply) {
        const {pwd} = request.query;
        if (pwd == process.env.ADMIN_PWD) {
            const token = jwt.sign("admin", process.env.TOKEN_SECRET);
            reply.status(200).send({ok:true, token });
        }
        else {
            reply.status(501).send({ok:false, error: "Unauthorized"});
        }
    });

  }
  