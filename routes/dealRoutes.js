var express = require('express');

var routes = function(db){
    var dealRouter = express.Router();

    var dealController = require('../controllers/dealController')(db);

    dealRouter.route('/')
        .get(dealController.getAllDeals);

    dealRouter.route('/today')
        .get(dealController.getTodaysDeals);
    
    dealRouter.route('/current')
        .get(dealController.getTodaysDeals);

    dealRouter.route('/date/:year/:month/:day')
        .get(dealController.getDealsForDate);

    dealRouter.route('/vendor/:vendorName/:year?/:month?/:day?')
        .get(dealController.getDealsForVendor);

    dealRouter.route('/image/:id')
        .get(dealController.getCoverImage);


    return dealRouter;
};

module.exports = routes;