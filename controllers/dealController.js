
var _ = require('lodash'),
    ObjectId = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    moment = require('moment');

var dealController = function(db) {


    var basicFieldsToReturn = [ '_id', 'vendor', 'link', 'title', 'text', 'createdAt' ];


    var getAllDeals = function (req, res){

        var dealsCollection = db.collection('deals');
        
        dealsCollection.find({}, basicFieldsToReturn).sort({ createdAt: -1 }).toArray(function (err, allDeals) {
            
            if (err) {
                res.status(500).send(err);
            }
            
            if (allDeals.length) {
                res.status(200).json(allDeals);
            } else {
                res.status(404);
            }


        });

    };



    var getTodaysDeals = function(req,res) {

        var now = moment();

        var aFewDaysAgo = moment().subtract(4, 'days').toDate(); // to cater for deals that last weekends, etc
        
        var dealsCollection = db.collection('deals');

        console.log("Looking for entries with createdAt greater than " + aFewDaysAgo + " against current time of " + moment().toDate());
        
        dealsCollection.find({ createdAt: { $gt: aFewDaysAgo } }, basicFieldsToReturn).sort({ createdAt: -1 }).toArray(function (err, recentDeals) {

            if (err) {
                res.status(500).send(err);
            }

            if (recentDeals.length) {
                var seenVendors = []
                var todaysDeals = _.filter(recentDeals, function(nextDeal) {
                    if (_.indexOf(seenVendors, nextDeal.vendor) == -1) {
                        seenVendors.push(nextDeal.vendor);
                        return true;
                    }
                    return false;
                });
                res.status(200).json(todaysDeals);
            } else {
                res.status(404);
            }


        });

    };

    var getDealsForDate = function(req,res) {

        var vendor = req.params.vendorName;
        var year = req.params.year;
        var month = req.params.month;
        var day = req.params.day;

        var mongoQ = { };

        constrainQueryStructureToDate(mongoQ, year, month, day);

        var dealsCollection = db.collection('deals');

        dealsCollection.find(mongoQ, basicFieldsToReturn).sort({ vendor: 1 }).toArray(function (err, recentDeals) {

            if (err) {
                res.status(500).send(err);
            }

            if (recentDeals.length) {
                res.status(200).json(recentDeals);
            } else {
                res.status(404);
            }

        });

    };

    function constrainQueryStructureToDate(mongoQ, year, month, day) {

        if (year || month || day) {
            console.log("Date specified is " + year + " - " + month + " - " + day);
        }

        if (year) {
            if (month) {
                month -= 1; // months are zero-based. *sigh*
                if (day) {
                    // day-based query
                    var dayOfInterest = new Date(year, month , day);
                    var queryDate= moment(dayOfInterest).startOf('day').toDate();
                    mongoQ.date = { $eq: queryDate };
                } else {
                    // month-based query
                    var dayOfInterest = new Date(year, month);
                    var startDate= moment(dayOfInterest).startOf('day').toDate();
                    var endDate= moment(dayOfInterest).endOf('month').toDate();
                    mongoQ.date = { $gte: startDate, $lte: endDate };
                }
            } else {
                // year-based query
                var dayOfInterest = new Date(year, 0);
                var startDate= moment(dayOfInterest).startOf('day').toDate();
                var endDate= moment(dayOfInterest).endOf('year').toDate();
                mongoQ.date = { $gte: startDate, $lte: endDate };
            }
        }

    }

    var getDealsForVendor = function (req, res) {

        var vendor = req.params.vendorName;
        var year = req.params.year;
        var month = req.params.month;
        var day = req.params.day;

        console.log("Vendor is: " + vendor);

        var mongoQ = { vendor: vendor };

        constrainQueryStructureToDate(mongoQ, year, month, day);

        var dealsCollection = db.collection('deals');

        dealsCollection.find(mongoQ, basicFieldsToReturn).sort({ createdAt: -1 }).toArray(function (err, recentDeals) {
            
            if (err) {
                res.status(500).send(err);
            }
            
            if (recentDeals.length) {
                res.status(200).json(recentDeals);
            } else {
                res.status(404);
            }

        });
       

    };

    var getCoverImage = function (req, res) {

        var dealsCollection = db.collection('deals');

        var record = {"_id": new ObjectId(req.params.id)};
        dealsCollection.findOne(record, function(err,result){
            if(err)
                res.status(500).send(err);
            else {

                try {
                    var contentType = result.imageMimeType;
                    var contentLength = result.imageContent.length;
                    var contentBinary = result.imageContent.read(0, contentLength);

                    res.status(200)
                        .type(contentType)
                        .set({'Content-Length': contentLength})
                        .send(contentBinary);
                } catch (e) {
                    console.log(e);
                    res.status(404).end();
                }
            }
        });


    };


    return {
        getAllDeals: getAllDeals,
        getTodaysDeals:getTodaysDeals,
        getDealsForDate:getDealsForDate,
        getDealsForVendor:getDealsForVendor,
        getCoverImage: getCoverImage
    }
}

module.exports = dealController;