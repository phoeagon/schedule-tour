/*
 * Login.
 */

var Message = require('../models/types/message');

var setRouter = function(app) {

    app.post('/message/send', message.sendMessage);
    app.post('/message/read', message.readMessages);

    app.get('/message/send', message.sendMessage);
    app.get('/message/read', message.readMessages);
};

function checkLogin(req, res, next) {
  console.log(req.session);
  console.log(req.session.user);
  if (!req.session.user) {
    req.flash('error', '未登入');
    return res.redirect('/');
  }
  next();
}


var message = (function() {
    //
    var resEndJSON = function(res, code, msg) {
        res.end(JSON.stringify({
            code    :   code,
            msg     :   msg
        }));
    };

    var send_message = function(req, res) {

        var message = new Message({
            userFrom    :   req.session.user._id,
            userTo      :   req.body.target,
            content     :   req.body.content,
            datetime    :   req.body.datetime,
            read        :   false
        });

        message.save(function(err) {
            if (err) {
                resEndJSON(res, 'ERR', 'Send Message Failed');
                return;
            }
            //add notification here
            resEndJSON(res, 'OK', 'Message Sent');
            return;
        });
    };

    var read_messages = function(req, res) {
        var target = req.query.target || req.body.target;
        var username = req.session.user._id;
        Message
            .find({
                $or:[
                    {userTo:username,userFrom:target},
                    {userTo:target,userFrom:username}
                ]
            })
            .find(function(err, results) {
                if (err) {
                    resEndJSON(res, 'ERR', 'Get Message Failed');
                    return;
                }
                //update
                resEndJSON(res, 'OK', results);
                results.map(function(r) {
                    console.log(r);
                    r.read = true;
                    r.save(function(err){
                        //pass
                    });
                });

                return;
            });
    };

    return {
        sendMessage :   send_message,
        readMessages:   read_messages
    };
})();

module.exports = {
    setRouter   :   setRouter,
};

