var expect = require('chai').expect,
    fs = require('fs'),
    sinon = require('sinon');

describe('Basic Vendor Parser Test', function () {


    it('Manning', function (done) {

        var manning = require("../parsers/manning");

        fs.readFile('./tests/data-samples/manning.js', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }

            manning.parser(data, function (deal) {

                expect(deal.vendor).to.equal("Manning");
                expect(deal.image).to.equal("http://www.manning.com/maras/maras_cover150.jpg");
                expect(deal.title).to.equal("Secrets of the JavaScript Ninja, Second Edition");
                expect(deal.text).to.equal("Get half off the MEAP eBook or MEAP pBook  Enter dotd052115 in the Promotional Code box when you check out.")
                done();

            });


        });


    })
})