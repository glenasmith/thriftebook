var parseString = require('xml2js').parseString;

module.exports = {

    vendor: "O'Reilly",

    url: "http://feeds.feedburner.com/oreilly/ebookdealoftheday",

    parser: function(body, next) {

        parseString(body, function (error, result) {

            var allContent = result.feed.entry[0].content[0]._;

            var coverRegexp = /.*?img src=['"](.*?)['"]/;

            var imageMatches = allContent.replace(/(\r\n|\n|\r)/gm, "").match(coverRegexp);

            var tidyTitle = result.feed.entry[0].title[0].replace(/(\r\n|\n|\r)/gm, "");

            // Title will now look like:  #Ebook Deal/Day: Learning MySQL and MariaDB - $21.49 (Save 50%) Use code DEAL 
            // Let's see if we can post process back to the real title.
            
            var titlePostProcessor = /.*?:\s(.*?)\s*?-\s*?\$.*/;

            var advancedTitleMatcher = tidyTitle.match(titlePostProcessor);

            if (advancedTitleMatcher) {
                tidyTitle = advancedTitleMatcher[1];
            }


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