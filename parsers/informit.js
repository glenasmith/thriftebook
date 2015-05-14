var parseString = require('xml2js').parseString;

module.exports = {

    vendor: "InformIT",

    url: "http://www.informit.com/deals/",

    parser: function(body, next) {

            var informitRegexp=/<div id="cover".*?<img src="(.*?)".*?alt="(.*?)".*?class="(.*)"/;

            var matches = body.replace(/(\r\n|\n|\r)/gm,"").match(informitRegexp);

            next({
                vendor: this.vendor,
                link: 'http://www.informit.com/deals',
                title: matches[2],
                image: 'http://www.informit.com' + matches[1],
                text: "Daily Deal"
            });

    }
}