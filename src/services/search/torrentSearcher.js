const rp = require('request-promise');
const $ = require('cheerio');

const baseUrl = "https://thepiratebay10.org";

const getSearchQuerys = (name, season) => ([
    `${name} s${season}`,
    `${name} season ${season}`,
    `${name} complete`
]);

const searchSerie = async (name, season) => {
    return [].concat.apply([], 
        await Promise.all(getSearchQuerys(name, season).map(s => doSearch(s, 1))));
};

const doSearch = async (query, page) => {
    return new Promise((onSuccess, onError) => {
        rp(`${baseUrl}/search/${query}/${page}/99/200`)
        .then(function(html){
            const rawDataTitles = $('td > div > a', html);
            const titles = [];
            for (let i = 0; i < rawDataTitles.length; i++) {
                titles.push(rawDataTitles[i].attribs.title)
            }
    
            const rawDataMagnet = $('td > a', html);
    
            const magnets = [];
            for (let i = 0; i < rawDataMagnet.length; i++) {
                const href = rawDataMagnet[i].attribs.href;
                if (href.includes("magnet"))
                    magnets.push(href)
            }
    
            const responses = [];
    
            for (let i = 0; i < titles.length; i++) {
                responses.push({title: titles[i], magnet: magnets[i]});
            }
            onSuccess(responses);
        })
        .catch(function(err){
            onError(err);
        });
    })
}

exports.search = searchSerie;