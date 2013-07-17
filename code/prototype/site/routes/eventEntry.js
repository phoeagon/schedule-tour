/*
 * Event Entry.
 */

var crypto = require('crypto');
var EventEntry = require('../models/types/eventEntry');
var utility = require('../models/utility');
var passwordHash = utility.passwordHash;
var ObjectId = require('../models/mongoose').Types.ObjectId;
var checkLogin = function(req, res, next) {
    if (req.session.user) {
	next();
    } else {
	res.end(JSON.stringify({ code : 'needLogIn' }));
    }
}

var listEntries = function(req, res) {
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
  }

var newEntry = function(req, res) {
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
    eventEntry.save(function(err, eventEntry) {
      if (err) {
        res.end(JSON.stringify({
          code  : 'ERR',
          msg   : err
        }));
        return;
      }
      res.end(JSON.stringify({
        code  : 'OK',
        id    : eventEntry.id
      }));

    });
};

var removeEntry = function(req, res) {
  EventEntry
    .where('_id')
    .equals(req.body.id)
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

var updateEntry = function(req, res) {
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
  EventEntry.findByIdAndUpdate(req.body.id,
      eventEntry,
      function(err) {
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
}

var setRouter = function(app) {
  app.post('/newevententry', checkLogin);
  app.post('/newevententry', newEntry);

  app.get('/evententries', checkLogin);
  app.get('/evententries', listEntries);
  app.post('/evententries', checkLogin);
  app.post('/evententries', listEntries);

  app.post('/removeevententry', checkLogin);
  app.post('/removeevententry', removeEntry);
  app.post('/updateevententry', checkLogin);
  app.post('/updateevententry', updateEntry);
};

module.exports = {
  setRouter : setRouter
};
