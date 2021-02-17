const MongoClient = require("./mongoClient");

const movieCollectionName = "movie";
const serieCollectionName = "serie";

function saveTorrent(torrent, collection) {
    return new Promise((res, err) => {
        collection.insertOne(torrent,
        (error, result) => {
            if (error != null) err(error);
            res(result);
        });
    });
}

function getTorrent(id, collection) {
    return new Promise((res, err) => {
        collection.find({id})
        .toArray(function(error, docs) {
            if (error != null) err(error);
            res(docs);
        });
    });
}

class TorrentRepository {

    constructor() {
        MongoClient.getClient().then(client => {
            this.client = client;
            this.movieCollection = this.client.collection(movieCollectionName);
            this.serieCollection = this.client.collection(serieCollectionName);
        });
    }

    saveSerie(torrent) {
        return saveTorrent({"id": `${torrent.id}`, "name":torrent.name, "hash":torrent.hash, "season": torrent.season}, this.serieCollection);   
    }

    saveMovie(torrent) {
        return saveTorrent({"id": `${torrent.id}`, "name":torrent.name, "hash":torrent.hash}, this.movieCollection);   
    }

    getSerie(id) {
        return getTorrent(id, this.serieCollection);
    }

    getMovie(id) {
        return getTorrent(id, this.movieCollection);
    }
}

class MovieTorrent {
    constructor(id, name, hash) {
        this.id = id;
        this.name = name;
        this.hash = hash;
    }
}

class SerieTorrent {
    constructor(id, name, hash, season) {
        this.id = id;
        this.name = name;
        this.hash = hash;
        this.season = season; 
    }
}

exports.TorrentRepository = TorrentRepository;
exports.MovieTorrent = MovieTorrent;
exports.SerieTorrent = SerieTorrent;