var WebSocketClient = (function() {
    var ws;
    var hostname = 'localhost';
    var port = 8000;
    var onlineList = {};
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

    return {
        run         :   run,
        onlineList  :   onlineList,
        username    :   username
    };

}());

$(function() {
    //do this script after login
    if (!username) return false;
    WebSocketClient.run(username);


});
