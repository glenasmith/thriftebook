var express = require('express'),
    nano = require('nano'),
    bodyParser = require('body-parser');

var db;
console.log('Starting up Thriftebook...');

db = nano(process.env.couchDbUrl || 'http://localhost:5984/thriftebook');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

dealsRouter = require('./routes/dealRoutes')(Book);


app.use('/api/deals', dealsRouter);


app.get('/', function(req, res){
    res.send('Welcome to the Thriftebook API');
});

app.listen(port, function(){
    console.log('Running Thriftebook on PORT: ' + port);
});

module.exports = app;