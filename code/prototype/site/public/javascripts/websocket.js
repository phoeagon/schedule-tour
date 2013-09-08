var WebSocketClient = (function() {
    var ws;
    var hostname = 'localhost';
    var port = 8000;
    var onlineList = {};
    var newMessageList = {};
    var callList = {};
    var username;

    var sendMessage = function(msg) {
        ws.send(msg);
    };

    var onopen = function() {
        ws.send(JSON.stringify({
            type    :   'init',
            username:   username
        }));
    };

    var onmessage = function(res) {
        var msg = JSON.parse(res.data);
        switch (msg.type) {
        case 'onlinelist':
            //onlineList = msg.data;
            $.extend(true, onlineList, msg.data);
            break;
        case 'text':
            if (humane && humane.log) {
                humane.log(msg.data);
            } else {
                alert(msg.data);
            }
            break;
        case 'locate':
            if (!onlineList[msg.username]) {
                onlineList[msg.username] = {};
            }
            onlineList[msg.username].position = msg.position;
            break;
        case 'newmessage':
            if (!newMessageList[msg.username]) {
                onlineList[msg.username] = 0;
            }
            onlineList[msg.username]++;
            if (humane && humane.log) {
                humane.log('new message from ' + msg.username);
            }
            humane.log('new message from ' + msg.username);
            break;
        case 'webrtc_request':
            if (humane && humane.log) {
                humane.log('receive call from ' + msg.username);
            } else {
                alert('receive call from ' + msg.username);
            }
            callList[msg.username] = {room: msg.room};
            break;
        case 'webrtc_stop':
            delete callList[msg.username];
            break;

        };

    };

    var onclose = function() {
        ws.send(JSON.stringify({
            type    :   'finit',
            username:   username
        }));
        if (humane && humane.log) humane.log("closed")
            else alert('closed');
    };

    var run = function(_username) {
        url = "ws://"+hostname+":"+port+"/";
        ws = new WebSocket(url);
        ws.onopen = onopen;
        ws.onmessage = onmessage;
        ws.onclose = onclose;
        username = _username;
    };

    var sendCallRequest = function(target, room) {
        sendMessage(JSON.stringify({
            type    :   'webrtc_request',
            username:   username,
            target  :   target,
            room    :   room
        }));
        
        
    }

    return {
        run         :   run,
        onlineList  :   onlineList,
        callList    :   callList,
        username    :   username,
        sendCallRequest :   sendCallRequest
    };

}());

$(function() {
    //do this script after login
    if (!username) return false;
    WebSocketClient.run(username);


});