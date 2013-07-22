var request = require('request');
var sleep = require('sleep');

var mongodb = require('../models/DB');

var count = 100;
var start = 0;
var total = 100;

var getEvents = function(loc, start, total) {
    if (start >= total) return;
    console.log('start: ' + start);
    console.log('total: ' + total);
    request.get(
        'http://api.douban.com/v2/event/list?loc='+loc+'&start='+start+'&count=100',
        function(err, res, body) {
            var message = JSON.parse(body);
            var data = message.events;
            console.log('records fetched: ' + data.length);

            console.log('recording...');
            mongodb.open(function(err, db) {
                if (err) {
                    throw err;
                }
                db.collection('douban_events', function(err, collection) {
                    if (err) {
                        mongodb.close();
                        throw err;
                    }
                    collection.insert(data, {safe:true}, function(err, res) {
                        mongodb.close();
                        console.log('recorded.');
                        console.log('sleeping...');
                        sleep.sleep(10);
                        console.log('waked up.');
                        getEvents(loc, start + message.count, message.total);
                    });
                });
            });
        }
    );
};
getEvents(108296, 0, 1000);

var getCityCode = function(start, total) {
    if (start >= total) return;
    console.log('start: ' + start);
    console.log('total: ' + total);
    request.get(
        'http://api.douban.com/v2/loc/list?start='+start+'&count=100',
        function(err, res, body) {
            var message = JSON.parse(body);
            var data = message.locs;
            console.log('records fetched: ' + data.length);

            console.log('recording...');
            mongodb.open(function(err, db) {
                if (err) {
                    throw err;
                }
                db.collection('douban_locs', function(err, collection) {
                    if (err) {
                        mongodb.close();
                        throw err;
                    }
                    collection.insert(data, {safe:true}, function(err, res) {
                        mongodb.close();
                        console.log('recorded.');
                        console.log('sleeping...');
                        sleep.sleep(20);
                        console.log('waked up.');
                        getCityCode(start + message.count, message.total);
                    });
                });
            });
        }
    );
};
//getCityCode(0, 1000);
