//require jQuery
//require WebSocketClient
var CallManager = (function() {
    var target;
    var username;

    var safeCb = function(cb) {
        if (!cb || (typeof cb != 'function')) return function(){};
        return cb;
    };


    var room;
    var webrtc;

    var show = function(_username, _target) {
        username = _username;
        target = _target;
        renderList();
        room = username;
    };

    var renderList = function() {
        var render = [];
        var ul = $('<ul>');
        render.push({
            title   :   'Call Between ' + username + '(Me) and ' + target,
            content :   
                $('<div>').append(
                    $('<div>').addClass('remote').css({height:'100px'})
                ).append(
                    $('<div>').addClass('local').css({height:'100px'})
                ).append(
                    $('<button>').text(WebSocketClient.callList[target] ? 'receive' : 'call').click(function() {
                        if ($(this).text() === 'stop') {
                            //webrtc.localStream.stop();
                            webrtc.connection.socket.disconnect();
                            $(this).text('call');
                            return false;
                        }
        // create our webrtc connection
        webrtc = new SimpleWebRTC({
            // the id/element dom element that will hold "our" video
            localVideoEl: $(this).prev().get(0),
            // the id/element dom element that will hold remote videos
            remoteVideosEl: $(this).prev().prev().get(0),
            // immediately ask for camera access
            autoRequestMedia: true,
            log: true
        });
                        if (WebSocketClient.callList[target]) {
                            webrtc.joinRoom(WebSocketClient.callList[target].room);
                        } else {
                            var val = '';
                            val = username;
                            webrtc.createRoom(val, function (err, name) {
                                if (!err || err=='token') {
                                    setRoom(name);
                                    WebSocketClient.sendCallRequest(target, name);

                                } else {
                                    console.log(err);
                                }
                            });
                        }
                        $(this).text('stop');
                        return false;          
                    })
                ).append(
                    $('<button>').text('back').click(function() {
                        togglePad();
                    })
                )
        });
        if ( callPad ){
            if (callPad.ele)
                callPad.destroy();
            callPad.show( render )
        }
    };

    var togglePad = function() {
        if (callPad) {
            if (callPad.ele) {
                callPad.destroy();
            } else {
                show();
            }
        }
    };

    var setRoom = function(_room) {
        room = _room;
    }


    return {
        show        :   show,
        togglePad   :   togglePad,
        setRoom     :   setRoom
    };

}());

