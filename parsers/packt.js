var parseString = require('xml2js').parseString;

module.exports = {

    vendor: "Packt",

    url: "https://www.packtpub.com/books/deal-of-the-day",

    parser: function(body, next) {

        body = body.replace(/(\r\n|\n|\r)/gm,""); // collapse to one line for easier matching

        var packtRegexp = /div class="dotd-main-book-image.*?a href="([^"]+)".*?img src="([^"]+)"/;

        var matches = body.match(packtRegexp);

        var titleRegexp = /div class="dotd-main-book-title.*?<h2>([^<]+)<\/h2>/;

        var titleMatches = body.match(titleRegexp);



        next( {
            vendor: this.vendor,
            link: "https://www.packtpub.com/" + matches[1],
            title: titleMatches[1],
            image: "http:" + matches[2],
            text: "Deal of the Day"
        });

    }
}