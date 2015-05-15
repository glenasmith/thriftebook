var express = require('express');

var routes = function(db){
    var dealRouter = express.Router();

    var dealController = require('../controllers/dealController')(db)
    dealRouter.route('/')
        .get(dealController.getAllDeals);

    dealRouter.route('/today')
        .get(dealController.getTodaysDeals)

    dealRouter.route('/date/:startDate')
        .get(dealController.getDealsForDate)

    dealRouter.route('/vendor/:vendorName')
        .get(dealController.getDealsForVendor)

    dealRouter.route('/vendor/:vendorName/:startDate')
        .get(dealController.getDealsForVendorOnDate)

    return dealRouter;
};

module.exports = routes;