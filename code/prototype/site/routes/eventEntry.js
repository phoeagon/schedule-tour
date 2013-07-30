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
        console.log('loged in');
        next();
    } else {
        console.log('needs login');
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
      endTime        : req.body.endTime,
      duration    : req.body.duration,
      position    : req.body.position,
      gps         : req.body.gps,
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
        _id    : eventEntry._id
      }));

    });
};

var removeEntry = function(req, res) {
  EventEntry
    .where('_id')
    .equals(req.body._id)
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
    console.log(req.body);
  var eventEntry = {
      user        : req.session.user._id,
      title       : req.body.title,
      description : req.body.description,
      place       : req.body.place,
      weight      : req.body.weight,
      time        : req.body.time,
      endTime     : req.body.endTime,
      duration    : req.body.duration,
      position    : req.body.position,
      gps         : req.body.gps ? req.body.gps : [],
      privacy     : req.body.privacy,
      finished    : false,
      alarms      : req.body.alarms ? req.body.gps : []
  };
  console.log(eventEntry);
  EventEntry.findByIdAndUpdate(req.body._id, 
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
var listTimelineEntries = function( req , res ) {
      EventEntry.find(
      {
        user: req.session.user._id
      },
      function(err, eventEntries) {
        if (err) {
          res.end(JSON.stringify(err));
          return;
        }
        var data = {
            timeline:           {
                                    "headline":"My ScheduleTour Timeline",
                                    "type":"default",
                                    "text":"<p>Find your events here</p>",
                                }
        }
        data.timeline.era = [];
        data.timeline.date = [];
        for (var ele in eventEntries){
            var tmp = {
                startDate : new Date(eventEntries[ele].time) ,
                endDate :   new Date(eventEntries[ele].endTime) ,
                headline:  eventEntries[ele].title ,
                text:"<p>Body text goes here, some HTML is OK</p>",
            }
            data.timeline.era . push( tmp )
            data.timeline.date. push( tmp )
        }
        res.end(JSON.stringify( data ));
    });
}
var listCalendarEntries = function(req, res) {
    EventEntry.find(
      {
        user: req.session.user._id
      },
      function(err, eventEntries) {
        if (err) {
          res.end(JSON.stringify(err));
          return;
        }
        var pool = eventEntries;
        for (var ele in pool){
            pool[ele]= {
                start : new Date(pool[ele].time) ,
                end : new Date(pool[ele].endTime) , 
                allDay : false , //assume
                title : pool[ele].title ,
                content: pool[ele].description
            }
            console.log( pool[ele] )
        }
        res.end(JSON.stringify( pool ));

    });
  }

var setRouter = function(app) {
  app.post('/newevententry', checkLogin);
  app.post('/newevententry', newEntry);

  app.get('/evententries', checkLogin);
  app.get('/evententries', listEntries);
  app.post('/evententries', checkLogin);
  app.post('/evententries', listEntries);
  
  app.get('/calendarentries', listCalendarEntries);
  app.get('/timelineentries', checkLogin);
  app.get('/timelineentries', listTimelineEntries);

  app.post('/removeevententry', checkLogin);
  app.post('/removeevententry', removeEntry);
  app.post('/updateevententry', checkLogin);
  app.post('/updateevententry', updateEntry);

  app.post('/event/new', checkLogin);
  app.post('/event/new', newEntry);

  app.get('/event/all', checkLogin);
  app.get('/event/all', listEntries);
  app.post('/event/all', checkLogin);
  app.post('/event/all', listEntries);

  app.post('/event/remove', checkLogin);
  app.post('/event/remove', removeEntry);
  app.post('/event/update', checkLogin);
  app.post('/event/update', updateEntry);
};

module.exports = {
  setRouter : setRouter ,
  checkLogin : checkLogin
};
