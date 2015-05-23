var request = require("request"),
    MongoClient = require('mongodb').MongoClient,
    Binary = require('mongodb').Binary,
    moment = require('moment');

console.log('Starting up Feed Fetcher for Thriftebook...');

var dbUrl = process.env.mongoDbUrl || 'mongodb://localhost:27017/thriftebook';

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


function populateImageInfo(deal, next) {

    if (deal.image) {

        console.log("Fetching image: " + deal.image);

        request.get({url: deal.image, encoding: null}, function (error, response, body) {

            if (error || response.statusCode != 200) {
                console.log(error);
                next(deal);
            }

            deal.imageContent = new Binary(body);
            deal.imageMimeType = response.headers['content-type'];
            next(deal);

        });

    } else {
        next(deal);
    }


}



function storeDealInDbIfRequired(deal, db, next) {

    var today= moment().startOf('day').toDate();
    var aWeekAgo = moment().subtract(3, "day").toDate(); // to cater for weekly deals, weekends without updates, etc

    deal.date = today;
    deal.createdAt = moment().toDate();
    
    var dealsCollection = db.collection('deals');

    dealsCollection.find({ vendor: deal.vendor, title: deal.title, createdAt: { $gte: aWeekAgo } }).toArray(function(err, existingDeals) {

        if (!existingDeals.length) {
            console.log("Inserting new title from " + deal.vendor + " into the database: " + deal.title);

            populateImageInfo(deal, function(err, dealWithImage) {

                // Insert some documents
                dealsCollection.insert([
                    deal
                ], function (err, insertedDeal) {
                    next(insertedDeal);
                });
            });
            
        } else {
            console.log("Ignoring existing Db deal from " + deal.vendor + ": " + deal.title);
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

MongoClient.connect(dbUrl, function (err, db) {

    mongoDb = db; // so we can close later..

    console.log("Connected correctly to MongoDb server at: " + dbUrl);

    feedsToParse.forEach(function(element) {
        try {
            console.log("Parsing feed: " + element.url);
            parseDeal(element, function(deal) {

                console.log("Done parsing feed: " + element.url);

                storeDealInDbIfRequired(deal, db, function (processedDeal) {
                    console.log("Processed Deal: " + processedDeal.title);
                    feedsParsed += 1;
                });
            });
        } catch (err) {
            console.log("Error parsing feed for: " + element.vendor + " at URL: " + element.url + " :" + err);
            feedsParsed += 1;
        }
    });

    console.log("Feed iterator finished");
    
});



var secondsWaitingSoFar = 0;
var MAX_FEED_FETCH_TIMEOUT_SECONDS = process.env.feedFetchTimeoutSecs || 15;

function waitForFeedParsersToFinish () {
    secondsWaitingSoFar += 1;
    if (secondsWaitingSoFar < MAX_FEED_FETCH_TIMEOUT_SECONDS) {
        console.log("After " + secondsWaitingSoFar + " seconds, we have parsed " + feedsParsed + " feeds");
        if (feedsParsed < feedsToParse.length) {
            setTimeout(waitForFeedParsersToFinish, 1 * 1000);
        } else {
            mongoDb.close();
        }
    } else {
        console.log("Aborting FeedFetch after timeout of " + MAX_FEED_FETCH_TIMEOUT_SECONDS + " seconds.");
        mongoDb.close();
    }
};

waitForFeedParsersToFinish();


