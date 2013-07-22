/*
 * Event Entry.
 */

var crypto = require('crypto');
var mongo = require('../models/DB');
var utility = require('../models/utility');
var checkLogin = function(req, res, next) {
    if (req.session.user) {
        console.log('loged in');
        next();
    } else {
        console.log('needs login');
        res.end(JSON.stringify({ code : 'needLogIn' }));
    }
}

var recommendEvents = function(req, res) {
    var lng, lat, dist, num;
    if (req.method === 'GET') {
        lng = req.query.lng;
        lat = req.query.lat;
        dist = req.query.dist;
        num = req.query.num;
    } else {
        lng = req.body.lng;
        lat = req.body.lat;
        dist = req.body.dist;
        num = req.body.num;
    }
    lng = parseFloat(lng);
    lat = parseFloat(lat);
    dist = parseFloat(dist);
    num = parseFloat(num);

    mongo.open(function(err, db) {
        if (err) {
            throw err;
        }
        db.collection('douban_events', function(err, collection) {
            if (err) {
                mongo.close();
                throw err;
            }
            collection
                .geoNear(lng, lat,
                    {
                        spherical   :   true,
                        maxDistance :   dist,
                        num         :   num
                    },
                    function(err, data) {
                    console.log(data);
                    res.end(JSON.stringify({
                        data    :   data
                    }));
                    mongo.close();
                });
        });
    });
}

var setRouter = function(app) {

    app.get('/event/recommend', checkLogin);
    app.get('/event/recommend', recommendEvents);
    app.post('/event/recommend', checkLogin);
    app.post('/event/recommend', recommendEvents);

};

module.exports = {
    setRouter : setRouter
};
