
var _ = require('lodash'),
    moment = require('moment');

var dealController = function(db) {

    var getAllDeals = function (req, res){

        var dealsCollection = db.collection('deals');
        
        dealsCollection.find({}).toArray(function (err, allDeals) {
            
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

        var today= now.startOf('day').unix();
        var yesterday = now.subtract(1, "day").unix();
        
        var dealsCollection = db.collection('deals');
        
        dealsCollection.find({ vendor: deal.vendor, title: deal.title, date: { $in: [yesterday, today] } }).toArray(function (err, recentDeals) {

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

    var getDealsForDate = function(req,res) {

        var vendor = req.params.vendorName;
        var year = req.params.year;
        var month = req.params.month;
        var day = req.params.day;

        var mongoQ = { };

        constrainQueryStructureToDate(mongoQ, year, month, day);

        var dealsCollection = db.collection('deals');

        dealsCollection.find(mongoQ).toArray(function (err, recentDeals) {

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
                    var queryDate= moment(dayOfInterest).startOf('day').unix();
                    mongoQ.date = { $eq: queryDate };
                } else {
                    // month-based query
                    var dayOfInterest = new Date(year, month);
                    var startDate= moment(dayOfInterest).startOf('day').unix();
                    var endDate= moment(dayOfInterest).endOf('month').unix();
                    mongoQ.date = { $gte: startDate, $lte: endDate };
                }
            } else {
                // year-based query
                var dayOfInterest = new Date(year, 0);
                var startDate= moment(dayOfInterest).startOf('day').unix();
                var endDate= moment(dayOfInterest).endOf('year').unix();
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

        dealsCollection.find(mongoQ).toArray(function (err, recentDeals) {
            
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

    


    return {
        getAllDeals: getAllDeals,
        getTodaysDeals:getTodaysDeals,
        getDealsForDate:getDealsForDate,
        getDealsForVendor:getDealsForVendor
    }
}

module.exports = dealController;