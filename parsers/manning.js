module.exports = {

    vendor: "Manning",

    url: "http://incsrc.manningpublications.com/dotd.js",

    parser: function (body, next) {


            var manningRegexp = /a href='([^']+)'>([^<]+).*img src='([^']+)'><\/a>([^"]+)/;

            var matches = body.match(manningRegexp);

            var detail = matches[4].replace(/<[^>]+/, " ").trim();

            next( {
                vendor: this.vendor,
                link: matches[1],
                title: matches[2],
                image: matches[3],
                text: detail
            });

    }
}
