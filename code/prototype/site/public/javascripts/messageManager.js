//require jQuery
//require WebSocketClient
var MessageManager = (function() {
    var messages = [];
    var target;
    var username;
    var message = {
        userFrom:   null,
        userTo  :   null,
        content :   null,
        datetime:   null,
        read    :   null
    };

    var safeCb = function(cb) {
        if (!cb || (typeof cb != 'function')) return function(){};
        return cb;
    };

    var remoteMessages = (function() { 

        var getMessages = function(target, callback) {
            messages = [];
            $.post('/message/read', {target: target}, function(data) {
                data = JSON.parse(data);
                if (data.code != 'OK') alert('get messages failed');
                data.msg.map(function(x) {
                    messages.push(x);
                });
                safeCb(callback)();
            });
        };

        var addMessage = function(target, content, callback) {
            $.post('/message/send',
                {
                    target: target,
                    content: content,
                    datetime: new Date(),
                },
                function(data) {
                    data = JSON.parse(data);
                    console.log( data )
                    if (data.code=='OK'){
                        console.log("successful")
                        safeCb(callback)();
                        return true;
                    }
                    alert("send message failed");
                    return false;
                }
            );
        };

        return {
            get :   getMessages,
            add :   addMessage
        };
    }());

    var showList = function(_username, _target) {
        username = _username;
        target = _target;
        remoteMessages.get(_target, function() {
            renderList();
        });
    };

    var renderList = function() {
        var render = [];
        var ul = $('<ul>');
        messages.map(function(x) {
            ul.append(
                $("<li>").append(
                    $("<p>").html(x.userFrom + ' says:')
                ).append(
                    $('<p>').html(x.content)
                ).append(
                    $('<p>').html( moment( x.datetime ).fromNow())
                )
            );
        });
        render.push({
            title   :   'Message List Between ' + username + '(Me) and ' + target,
            content :   
                $('<div>').append(
                    ul
                ).append(
                    $('<input>')
                ).append(
                    $('<button>').text('say').click(function() {
                        var _this = this;
                        remoteMessages.add(target, $(_this).prev().val(), function(msg) {
                            console.log(msg);
                            showList(username, target);
                        });
                        return false;
                    })
                ).append(
                    $('<button>').text('back').click(function() {
                        togglePad();
                    })
                )
        });
        if ( messagePad ){
            if (messagePad.ele)
                messagePad.destroy();
            messagePad.show( render )
        }
    };

    var togglePad = function() {
        if (messagePad) {
            if (messagePad.ele) {
                messagePad.destroy();
            } else {
                showList();
            }
        }
    };
    return {
        showList    :   showList,
        togglePad   :   togglePad
    };

}());

