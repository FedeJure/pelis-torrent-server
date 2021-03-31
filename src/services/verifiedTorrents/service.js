const { TorrentRepository, MovieTorrent, SerieTorrent } = require("../../repositories/torrents");

const torrentsRepository = new TorrentRepository();

exports.getMovieTorrentsWithId = movieId => {
    return torrentsRepository.getMovie(movieId)
        .then(res => res.map(t => ({title: t.name, magnet: t.hash})));
}