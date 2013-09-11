/*
 * Login.
 */

var Message = require('../models/types/message');
var WebSocketClient = require('websocket').client;

//var wsaddr = 'localhost'
//var wsport = '8000'


var setRouter = function(app, addr, port) {
    if (!addr) addr = 'localhost'
    if (!port) port = 8000
    wsaddr = addr
    wsport = port

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

        var userFrom = req.session.user._id;
        var userTo = req.body.target;
        var message = new Message({
            userFrom    :   userFrom,
            userTo      :   userTo,
            content     :   req.body.content,
            datetime    :   req.body.datetime,
            read        :   false
        });

        message.save(function(err) {
            if (err) {
                resEndJSON(res, 'ERR', 'Send Message Failed');
                return;
            }
            resEndJSON(res, 'OK', 'Message Sent');
            //add notification here

            var client = new WebSocketClient();

            client.on('connectFailed', function(error) {
                console.log('Connect Error: ' + error.toString());
            });

            client.on('connect', function(connection) {
                connection.sendUTF(JSON.stringify({
                    type    :   '_server_message',
                    username:   userFrom,
                    target  :   userTo
                }), function() {
                    connection.close();
                });
            });

            client.connect('ws://'+wsaddr+':'+wsport);
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

