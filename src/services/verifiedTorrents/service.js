const { TorrentRepository, MovieTorrent, SerieTorrent } = require("../../repositories/torrents");

const torrentsRepository = new TorrentRepository();

exports.getMovieTorrentsWithId = movieId => {
    return torrentsRepository.getMovie(movieId)
        .then(res => res.map(t => ({title: t.name, magnet: t.hash})));
}

exports.getSerieTorrentsWithId = serieId => {
    return torrentsRepository.getSerie(serieId)
        .then(res => res.map(t => ({title: t.name, magnet: t.hash})));
}

exports.saveMovie = ({id, name, hash, audioType, subtitlesType}) => {
    const torrent = new MovieTorrent(id,name,hash, audioType, subtitlesType);
    return torrentsRepository.saveMovie(torrent)
}

exports.saveSerie = ({id, name, season, hash, audioType, subtitlesType}) => {
    const torrent = new SerieTorrent(id,name,hash,season, audioType, subtitlesType);
}