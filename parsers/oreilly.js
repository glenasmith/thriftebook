var parseString = require('xml2js').parseString;

module.exports = {

    vendor: "O'Reilly",

    url: "http://feeds.feedburner.com/oreilly/ebookdealoftheday",

    parser: function(body, next) {

        parseString(body, function (error, result) {

            var allContent = result.feed.entry[0].content[0]._;

            var coverRegexp = /.*?img src='(.*?)'/;

            var imageMatches = allContent.replace(/(\r\n|\n|\r)/gm, "").match(coverRegexp);

            var tidyTitle = result.feed.entry[0].title[0].replace(/(\r\n|\n|\r)/gm, "");

            next({
                vendor: "O'Reilly", // hacky because of compromised this..
                link: result.feed.entry[0]['feedburner:origLink'][0],
                title: tidyTitle,
                image: imageMatches[1],
                text: allContent
            });

        })
    }
}