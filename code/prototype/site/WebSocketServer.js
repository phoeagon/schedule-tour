#!/usr/bin/env node
/************************************************************************
 *  Copyright 2010-2011 Worlize Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

var WebSocketServer = require('websocket/lib/WebSocketServer');
var http = require('http');
var url = require('url');
var fs = require('fs');

var args = { /* defaults */
    port: '8000',
    debug: false
};

/* Parse command line options */
var pattern = /^--(.*?)(?:=(.*))?$/;
process.argv.forEach(function(value) {
    var match = pattern.exec(value);
    if (match) {
        args[match[1]] = match[2] ? match[2] : true;
    }
});

var port = parseInt(args.port, 10);
var debug = args.debug;

console.log("WebSocket-Node: echo-server");
console.log("Usage: ./echo-server.js [--port=8080] [--debug]");

var server = http.createServer(function(request, response) {
    if (debug) console.log((new Date()) + " Received request for " + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(port, function() {
    console.log((new Date()) + " Server is listening on port " + port);
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true,
    maxReceivedFrameSize: 64*1024*1024,   // 64MiB
    maxReceivedMessageSize: 64*1024*1024, // 64MiB
    fragmentOutgoingMessages: false,
    keepalive: false,
    disableNagleAlgorithm: false
});

var onlineList = {};
debug = 1;

wsServer.on('connect', function(connection) {
    if (debug) console.log((new Date()) + " Connection accepted" +
                            " - Protocol Version " + connection.webSocketVersion);
    function sendCallback(err) {
        if (err) console.error("send() error: " + err);
    }

    function safeCb(cb) {
        if (cb && (typeof cb == 'function')) return cb;
        return function(){};
    }

    function sendTo(username, msg, cb) {
        if (!msg) return;
        if (!onlineList[username]) return;
        onlineList[username].connection.sendUTF(msg, sendCallback);
        safeCb(cb)();
    }

    function sendToAll(msg, cb) {
        if (!msg) return;
        for (var i in onlineList) {
            onlineList[i].connection.sendUTF(msg, sendCallback);
        }
        safeCb(cb)();
    }

    function filter(online) {
        var ret = {};
        for (var i in online) {
            ret[i] = {};
            ret[i].position = online[i].position;
        }
        console.log(ret);
        return ret;
    }

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            if (debug) console.log("Received utf-8 message of " + message.utf8Data.length + " characters.");
            var json = message.utf8Data;
            console.log(json);
            var data = JSON.parse(json);
            switch (data.type) {
                case 'init':
                    //send login to all others
                    sendToAll(JSON.stringify({
                        type    :   'login',
                        username:   data.username
                    }), null);
                    onlineList[data.username] = {connection: connection};
                    //send welcome message
                    sendTo(data.username, JSON.stringify({
                        type    :   'text',
                        data    :   'Welcome back!'
                    }), null);
                    //send online user list
                    sendTo(data.username, JSON.stringify({
                        type    :   'onlinelist',
                        data    :   filter(onlineList)
                    }), null);
                    break;
                case 'finit':
                    //delete from online list
                    delete onlineList[data.username];
                    //send logout to all others
                    sendToAll(JSON.stringify({
                        type    :   'logout',
                        username:   data.username
                    }), null);
                    //send byte message
                    sendTo(data.username, JSON.stringify({
                        type    :   'text',
                        data    :   'Bye!'
                    }), null);
                    break;
                case 'locate':
                    if (!onlineList[data.username]) break;
                    //record the position
                    onlineList[data.username].position = data.position;
                    //send position to users
                    sendToAll(JSON.stringify({
                        type    :   'locate',
                        username:   data.username,
                        position:   data.position
                    }), null);
                    break;
                case '_server_message':
                    sendTo(data.target, JSON.stringify({
                        type    :   'newmessage',
                        username:   data.username
                    }));
                    break;
                case 'webrtc_request':
                    sendTo(data.target, JSON.stringify({
                        type    :   'webrtc_request',
                        username:   data.username,
                        room    :   data.room
                    }));
                    break;

            };
            //connection.sendUTF(message.utf8Data, sendCallback);
        }
        else if (message.type === 'binary') {
            if (debug) console.log("Received Binary Message of " + message.binaryData.length + " bytes");
            connection.sendBytes(message.binaryData, sendCallback);
        }
    });
    connection.on('close', function(reasonCode, description) {
        if (debug) console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
    });
});
