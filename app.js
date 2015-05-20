var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser');

var db;
console.log('Starting up Thriftebook...');

var dbUrl = process.env.mongoDbUrl || 'mongodb://localhost:27017/thriftebook';

var app = express();

var port = process.env.PORT || 3000;

var dealsRouter;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('./temp'));

MongoClient.connect(dbUrl, function(err, db) {

    console.log("Connected correctly to MongoDb server at: " + dbUrl);

    dealsRouter = require('./routes/dealRoutes')(db);

    app.use('/api/deals', dealsRouter);

});

app.get('/', function(req, res){
    res.send('Welcome to the Thriftebook API');
});

app.listen(port, function(){
    console.log('Running Thriftebook on PORT: ' + port);
});

module.exports = app;