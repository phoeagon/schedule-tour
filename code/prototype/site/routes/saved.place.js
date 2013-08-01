/*
 * saved Place
 */

var savedPlace = require('../models/types/savedPlace');
var utility = require('../models/utility');
var passwordHash = utility.passwordHash;
var ObjectId = require('../models/mongoose').Types.ObjectId;
var checkLogin = function(req, res, next) {
    if (req.session.user) {
        console.log('loged in');
        next();
    } else {
        console.log('needs login');
        res.end(JSON.stringify({ code : 'needLogIn' }));
    }
}

var listPlaces = function(req, res) {
    savedPlace.find(
      {
        user: req.session.user._id
      },
      function(err, places) {
        if (err) {
          res.end(JSON.stringify({
            code  : 'ERR',
            msg   : err
          }));
          return;
        }
        res.end(JSON.stringify({
          code          : 'OK',
          places  : places
        }));

    });
  }

var newPlace = function(req, res) {
    console.log( req.body )
    var place = new savedPlace({
      user        : req.session.user._id,
      title       : req.body.title ,
      point       : req.body.point ,
      zoom        : req.body.zoom
    });
    console.log( "newPlace" )
    console.log( place._id )
    place.save(function(err, place) {
      if (err) {
        res.end(JSON.stringify({
          code  : 'ERR',
          msg   : err
        }));
        return;
      }
      res.end(JSON.stringify({
        code  : 'OK',
        _id    : place._id
      }));

    });
};

var removePlace = function(req, res) {
  savedPlace
    .where('_id')
    .equals(req.query._id)
    .remove(function(err) {
      if (err) {
        res.end(JSON.stringify({
          code  : 'ERR',
          msg   : err
        }));
        return;
      }
      res.end(JSON.stringify({
        code          : 'OK'
      }));
    });
};


var setRouter = function(app) {
    app.get('/saved.places/list',checkLogin)
    app.get('/saved.places/list',listPlaces)
    app.post('/saved.places/new',checkLogin)
    app.post('/saved.places/new',newPlace)
    app.get('/saved.places/remove',checkLogin)
    app.get('/saved.places/remove',removePlace)
};

module.exports = {
  setRouter : setRouter
};
