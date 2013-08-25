var sys = require("sys")
  , ws = require('websocket-server/lib/ws/server');

var server = ws.createServer({debug: true});

// Handle WebSocket Requests
server.addListener("connection", function(conn){

  console.log('Connected: ' + conn.id);
  conn.send("Connection: "+conn.id);

  conn.addListener("message", function(message){
    console.log('message from: ' + conn.id);
    console.log('message conent: ' + message);
    conn.broadcast("<"+conn.id+"> "+message);

    if(message == "error"){
      conn.emit("error", "test");
    }
  });
});

server.addListener("error", function(){
  console.log(Array.prototype.join.call(arguments, ", "));
});

server.addListener("disconnected", function(conn){
  server.broadcast("<"+conn.id+"> disconnected");
  console.log("<"+conn.id+"> disconnected");
});

server.listen(8000);
console.log('listening to port 8000');
