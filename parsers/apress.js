var parseString = require('xml2js').parseString;

module.exports = {

    vendor: "Apress",

    url: "http://www.apress.com/index.php",

    parser: function(body, next) {

        var apressRegexp=/<div class="block block-dotd">.*?<a href="(.*?apress\.com\/dailydeals\/.*?)".*?<img.*?src="(.*?)".*?alt="(.*?)"/i;

        var matches = body.replace(/(\r\n|\n|\r)/gm,"").match(apressRegexp);

        next({
            vendor: this.vendor,
            link: matches[1],
            title: matches[3],
            image: matches[2],
            text: "$10 Daily Deal"
        });
    }
}