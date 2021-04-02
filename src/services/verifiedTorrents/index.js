const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const service = require('./service')

dotenv.config();

module.exports = async function (fastify, opts) {
    fastify.get('/verifiedTorrents/movie', async function (request, reply) {
        const {movieId} = request.query;
        service.getMovieTorrentsWithId(movieId).then(results => {
            reply.status(200).send(results);
        },
        err => {
            reply.status(501).send(err);
        })
    });

    fastify.get('/verifiedTorrents/serie', async function (request, reply) {
        const {serieId} = request.query;
        service.getSerieTorrentsWithId(serieId).then(results => {
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
        service.saveMovie(request.body).then(result => {
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
        service.saveSerie(request.body).then(result => {
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
  