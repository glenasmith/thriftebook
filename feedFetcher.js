var request = require("request"),
    nano = require('nano'),
    moment = require('moment');

console.log('Starting up Feed Fetcher for Thriftebook...');

db = nano(process.env.couchDbUrl || 'http://localhost:5984/thriftebook');

function parseDeal(vendor, next) {

    request(vendor.url, function (error, response, body) {
        if (error)
            throw error;

        if (response.statusCode == 200) {
            vendor.parser.call(vendor, body, next);
        } else {
            throw response.statusCode;
        }

    })
}

function storeDealInCouchIfRequired(deal, next) {

    var now = moment();

    var today= now.startOf('day').unix();
    var yesterday = now.subtract(1, "day").unix();

    deal.date = today;
    deal.createdAt = now;

    db.view('deals', 'by_date', {startKey: yesterday, endKey: today, descending: true}, function(err, body) {
        var foundIt = false;
        body.rows.forEach(function(row) {
            var dbDeal = row.value;
            if (dbDeal.vendor == deal.vendor) {
                if (dbDeal.title == deal.title) {
                    foundIt = true;
                    console.log(deal.title + " from " + deal.vendor + " is already in the Db, skipping..");
                }
            }
        })
        if (!foundIt) {
            console.log("Inserting new title from " + deal.vendor + " into the database: " + deal.title);
            db.insert(deal, next(deal));
        } else {
            next(deal); // don't need to insert it, but pass it on for next in chain..
        }

    });

}


var manning = require("./parsers/manning"),
    oreilly = require("./parsers/oreilly"),
    apress = require("./parsers/apress"),
    informit = require("./parsers/informit");

var feedsToParse = [ manning, oreilly, apress, informit];

var feedsParsed = 0;

feedsToParse.forEach(function(element) {
    try {
        console.log("Parsing feed: " + element.url);
        parseDeal(element, function(deal) {

            console.log("Done parsing feed: " + element.url);

            storeDealInCouchIfRequired(deal, function(processedDeal) {
                feedsParsed += 1;
            })
        });
    }
    catch(err) {
        console.log("Error parsing feed for: " + element.vendor + " at URL: " + element.url + " :" + err);
        feedsParsed += 1;
    }
});

var secondsWaitingSoFar = 0;
var MAX_FEED_FETCH_TIMEOUT_SECONDS = process.env.feedFetchTimeoutSecs || 15;

function waitForFeedParsersToFinish () {
    secondsWaitingSoFar += 1;
    if (secondsWaitingSoFar < MAX_FEED_FETCH_TIMEOUT_SECONDS) {
        console.log("After " + secondsWaitingSoFar + " seconds, we have parsed " + feedsParsed + " feeds");
        if (feedsParsed < feedsToParse.length) setTimeout(waitForFeedParsersToFinish, 1 * 1000);
    } else {
        console.log("Aborting FeedFetch after timeout of " + MAX_FEED_FETCH_TIMEOUT_SECONDS + " seconds.");
    }
};

waitForFeedParsersToFinish();

console.log('Finished Feed Fetcher for Thriftebook...');


