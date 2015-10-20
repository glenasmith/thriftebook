module.exports = {

    vendor: "Manning",

    url: "http://www.manning.com/dotd",

    parser: function (body, next) {

            var manningTitleRegexp=/<div class="product-placeholder-title">([^<]+).*/i;
            var manningRegexp=/<div style="background-image: url\('([^']+)'\)"\s+class="product-thumbnail">.*<div class="brief">([^<]+).*?<div class="grabline">(.*?)<\/div>/i;

            var onelineBody = body.replace(/(\r\n|\n|\r)/gm,"");

            var titleMatch = onelineBody.match(manningTitleRegexp);
            var matches = onelineBody.match(manningRegexp);
            var dealText = (matches[2].trim() + ". " + matches[3].trim()).replace(/<\/?[^>]+?>/g, ""); // strip html

            next( {
                vendor: this.vendor,
                link: "http://www.manning.com/dotd",
                title: titleMatch[1].trim(),
                image: matches[1],
                text: dealText
            });

    }
}
