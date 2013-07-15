/*
 * Event Entry.
 */

var crypto = require('crypto');
var EventEntry = require('../models/types/eventEntry');
var utility = require('../models/utility');
var passwordHash = utility.passwordHash;
var ObjectId = require('../models/mongoose').Types.ObjectId;
var checkLogin = require('./account').checkLogin;


var setRouter = function(app) {
  app.post('/newevententry', checkLogin);
  app.post('/newevententry', function(req, res) {
    var eventEntry = new EventEntry({
      user        : req.session.user._id,
      title       : req.body.title,
      description : req.body.description,
      place       : req.body.place,
      weight      : req.body.weight,
      time        : req.body.time,
      endTime     : req.body.endTime,
      position    : req.body.position,
      privacy     : req.body.privacy,
      finished    : false,
      alarms      : req.body.alarms
    });
    eventEntry.save(function(err) {
      if (err) {
        res.end(JSON.stringify({
          code  : 'ERR',
          msg   : err
        }));
        return;
      }
      res.end(JSON.stringify({
        code  : 'OK'
      }));

    });
  });


  app.post('/evententries', checkLogin);
  app.post('/evententries', function(req, res) {
    EventEntry.find(
      {
        user: req.session.user._id
      },
      function(err, eventEntries) {
        if (err) {
          res.end(JSON.stringify({
            code  : 'ERR',
            msg   : err
          }));
          return;
        }
        res.end(JSON.stringify({
          code          : 'OK',
          eventEntries  : eventEntries
        }));

    });
  });

  
};

module.exports = {
  setRouter : setRouter
};