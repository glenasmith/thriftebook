var express = require('express');

var routes = function(Book){
    var dealRouter = express.Router();

    var dealController = require('../controllers/dealController')(Book)
    dealRouter.route('/')
        .get(dealController.getAllDeals);

    dealRouter.route('/today')
        .get(dealController.getTodaysDeals)

    dealRouter.route('/date/:startDate')
        .get(dealController.getDealsForDate)

    dealRouter.route('/date/vendor/:vendorName')
        .get(dealController.getDealsForVendor)

    dealRouter.route('/date/vendor/:vendorName/:startDate')
        .get(dealController.getDealsForVendorOnDate)

    return dealRouter;
};

module.exports = routes;