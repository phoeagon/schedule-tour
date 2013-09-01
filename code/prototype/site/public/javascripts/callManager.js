//require jQuery
var CallManager = (function() {
    var target;
    var username;

    var safeCb = function(cb) {
        if (!cb || (typeof cb != 'function')) return function(){};
        return cb;
    };


    // create our webrtc connection
    var webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: 'remotes',
        // immediately ask for camera access
        autoRequestMedia: false,
        log: true
    });
    var room;

    var show = function(_username, _target) {
        username = _username;
        target = _target;
        renderList();
        room = 'username#target';
        // when it's ready, join if we got a room from the URL
        webrtc.on('readyToCall', function () {
            // you can name it anything
            if (room) webrtc.joinRoom(room);
        });
    };

            


    var renderList = function() {
        var render = [];
        var ul = $('<ul>');
        render.push({
            title   :   'Call Between ' + username + '(Me) and ' + target,
            content :   
                $('<div>').append(
                    $('<div>').addClass('remote')
                ).append(
                    $('<div>').addClass('local')
                ).append(
                    $('<button>').text('call').click(function() {
                        var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
                        webrtc.createRoom(val, function (err, name) {
                            var newUrl = location.pathname + '?' + name;
                            if (!err) {
                                history.replaceState({foo: 'bar'}, null, newUrl);
                                setRoom(name);
                            }
                        });
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
    return {
        show        :   show,
        togglePad   :   togglePad
    };

}());

