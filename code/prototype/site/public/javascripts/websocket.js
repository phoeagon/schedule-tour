$(function() {
    var hostname = 'localhost';
    var port = 8000;
    url = "ws://"+hostname+":"+port+"/echo";
    w = new WebSocket(url);
    w.onopen = function() {
        w.send("thank you for the request");
    }
    w.onmessage = function(e) {
        var msg = e.data;
        if (humane && humane.log) {
            humane.log(msg);
        } else {
            alert(msg);
        }
    };
    w.onclose = function(e) {
        if (humane && humane.log) humane.log("closed")
        else alert('closed');
    }
    function sendMessage(msg) {
        w.send(msg);
    }

});
