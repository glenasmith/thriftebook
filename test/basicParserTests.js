var expect = require('chai').expect,
    fs = require('fs'),
    sinon = require('sinon');

describe('Basic Vendor Parser Test', function () {

    it('Manning', function (done) {

        var manning = require("../parsers/manning");

        fs.readFile('./test/data-samples/manning.html', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }

            manning.parser(data, function (deal) {

                expect(deal.vendor).to.equal("Manning");
                expect(deal.image).to.equal("https://images.manning.com/330/440/resize/book/5/c571a23-0d49-49af-9f2f-252244f6edd3/Learn_Go_meap.png");
                expect(deal.title).to.equal("Learn Go");
                expect(deal.text).to.equal("Get half off Learn Go. Use code dotd102015 at checkout before this deal expires at midnight, Eastern time.")
                done();

            });
        });
    });

    it("O'Reilly", function (done) {

        var oreilly = require("../parsers/oreilly");

        fs.readFile('./test/data-samples/oreilly.xml', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }

            oreilly.parser(data, function (deal) {

                expect(deal.vendor).to.equal("O'Reilly");
                expect(deal.image).to.equal("http://covers.oreilly.com/images/0636920042570/bkt.gif");
                expect(deal.title).to.equal("Mastering MEAN Web Development");
                expect(deal.text).to.equal('Get "Mastering MEAN Web Development" today using code DEAL and save 50%!   This sale ends at 2:00 AM 2015-05-22 (PDT, GMT-8:00).')
                done();

            });
        });
    });

    it("Apress", function (done) {

        var apress = require("../parsers/apress");

        fs.readFile('./test/data-samples/apress.html', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }

            apress.parser(data, function (deal) {

                expect(deal.vendor).to.equal("Apress");
                expect(deal.image).to.equal("http://www.apress.com/media/catalog/product/cache/9/small_image/125x/040ec09b1e35df139433887a97daa66f/A/9/A9781430260073-small.png");
                expect(deal.title).to.equal("Expert PHP and MySQL");
                expect(deal.text).to.equal('$10 Daily Deal')
                done();
            });
        });
    });


    it("Informit", function (done) {

        var informit = require("../parsers/informit");

        fs.readFile('./test/data-samples/informit.html', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }

            informit.parser(data, function (deal) {

                expect(deal.vendor).to.equal("InformIT");
                expect(deal.image).to.equal("http://www.informit.com/ShowCover.aspx?isbn=0133599418&amp;type=f");
                expect(deal.title).to.equal("Successful Management Guidelines (Collection)");
                expect(deal.text).to.equal('Daily Deal')
                done();
            });
        });
    });

    it("Packt", function (done) {

        var packt = require("../parsers/packt");

        fs.readFile('./test/data-samples/packt.html', 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }

            packt.parser(data, function (deal) {

                expect(deal.vendor).to.equal("Packt");
                expect(deal.image).to.equal("http://d255esdrn735hr.cloudfront.net/sites/default/files/imagecache/dotd_main_image/9065OS_R Data Analysis Cookbook.jpg");
                expect(deal.title).to.equal("R Data Analysis Cookbook [eBook]");
                expect(deal.text).to.equal('Deal of the Day')
                done();
            });
        });
    });


})