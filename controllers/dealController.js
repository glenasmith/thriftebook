
var nano = require('nano'),
     _ = require('lodash'),
    moment = require('moment');

var dealController = function(db) {

    var getAllDeals = function(req,res){

    };

    var getTodaysDeals = function(req,res) {

        var now = moment();

        var today= now.startOf('day').unix();
        var yesterday = now.subtract(1, "day").unix();

        db.view('deals', 'by_date', {startKey: yesterday, endKey: today, descending: true}, function(err, body) {

            if (err) {
                res.status(500).send(err);
            }

            var recentDeals = _.map(body.rows, function(row) {
                return row.value;
            });
            if (recentDeals.length) {
                res.status(200).json(recentDeals);
            } else {
                res.status(404);
            }


        });

    };

    var getDealsForDate = function(req,res) {

    };

    var getDealsForVendor = function (req, res) {

        console.log("Vendor is: " + req.params.vendorName);
        db.view('deals', 'by_vendor', { key: req.params.vendorName, descending: true }, function (err, body) {
            
            if (err) {
                res.status(500).send(err);
            }
            
            if (!body) {
                res.status(404)
            }
            
            var recentDeals = _.map(body.rows, function (row) {
                return row.value;
            });
            if (recentDeals.length) {
                res.status(200).json(recentDeals);
            } else {
                res.status(404);
            }


        });
       

    };

    var getDealsForVendorOnDate = function(req,res) {

    };


    return {
        getAllDeals: getAllDeals,
        getTodaysDeals:getTodaysDeals,
        getDealsForDate:getDealsForDate,
        getDealsForVendor:getDealsForVendor,
        getDealsForVendorOnDate:getDealsForVendorOnDate
    }
}

module.exports = dealController;