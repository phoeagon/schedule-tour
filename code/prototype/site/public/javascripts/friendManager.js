//require jQuery
//require WebSocketClient
var friendManager = (function() {
    var friends = [];
    var friend = {
        name    :   null,
        online  :   null,
        position:   null
    };

    var safeCb = function(cb) {
        if (!cb || (typeof cb != 'function')) return function(){};
        return cb;
    };

    var remoteFriends = (function() { 

        var getFriends = function(callback) {
            friends = [];
            $.getJSON('/friends/list',function(data) {
                if (data.code != 'OK') alert('get friends failed');
                data.msg.friendsTo.map(function(x) {
                    friends.push({
                        username:   x,
                        online  :   null,
                        position:   null
                    });
                });
                //friendManager.configureButton( ScheduleTour.getMap() )
                safeCb(callback)();
            });
        };

        var removeFriend = function(target, callback) {
            $.post('/friends/del',
                {target : target},
                function(data) {
                    data = JSON.parse(data);
                    console.log( data )
                    if (data.code=='OK'){
                        console.log("successful")
                        safeCb(callback)();
                        return true;
                    }
                    alert("remove friend failed");
                    return false;
                }
            );
        };

        var addFriend = function(target, callback) {
            $.post('/friends/add',
                {target : target},
                function(data) {
                    data = JSON.parse(data);
                    console.log( data )
                    if (data.code=='OK'){
                        console.log("successful")
                        safeCb(callback)();
                        return true;
                    }
                    alert("add friend failed");
                    return false;
                }
            );
        };

        var searchFriend = function(target, callback) {
            $.post('/friends/search',
                {target : target},
                function(data) {
                    data = JSON.parse(data);
                    console.log( data )
                    if (data.code=='OK'){
                        safeCb(callback)(data.msg);
                        return true;
                    }
                    alert("search friend failed");
                    return false;
                }
            );
        };
        return {
            get :   getFriends,
            add :   addFriend,
            del :   removeFriend,
            search: searchFriend
        };
    }());

    var showList = function() {
        var online = WebSocketClient.onlineList;
        remoteFriends.get(function() {
            friends.map(function(x) {
                if (online[x.username]) {
                    x.online = true;
                    if (online[x.username].position) {
                        x.position = online[x.username].position;
                    }
                }
            });
            renderList();
        });
    };

    var renderList = function() {
        var render = [];
        render.push({
            title   :   'Toolbox',
            content :   
                $('<div>').append(
                    $('<input>')
                ).append(
                    $('<button>').text('search').click(function() {
                        var _this = this;
                        remoteFriends.search($(_this).prev().val(), function(userlist) {
                            console.log(userlist);
                            var ul = $(_this).next();
                            ul.empty();
                            userlist.map(function(x) {
                                ul.append(
                                    $('<li>').append(
                                        $('<span>').text(x)
                                    ).append(
                                        $('<button>').text('add').click(function() {
                                            remoteFriends.add(x, function() {
                                                showList();
                                            });
                                            return false;
                                        })
                                    )
                                );
                            });
                        });
                        return false;
                    })
                ).append(
                    $('<ul>')
                )
        });
        friends.map(function(x) {
            render.push({
                title: x.username + '[' + (x.online ? 'online' : 'offline') + ']',
                content:
                $("<div>").append(
                    $("<p>").html(x.username + (x.position ? (' at '+x.position.toString()) : ''))
                ).append(
                    $("<a>").addClass("btn btn-primary").attr("href","javascript:void(0);").html("Locate")
                ).append(
                    $("<a>").addClass("btn btn-default").attr("href","javascript:void(0);").html("Message").click(function() {
                        MessageManager.showList(username, x.username);
                    })
                ).append(
                    $("<a>").addClass("btn btn-default").attr("href","javascript:void(0);").html("Call").click(function() {
                        CallManager.show(username, x.username);
                    })
                ).append(
                    $("<a>").addClass("btn btn-default").attr("href","javascript:void(0);").html("x").click(function() {
                        remoteFriends.del(x.username, function() {
                            showList();
                        });
                    })
                )
            });
        });
        if ( resultPad ){
            if (resultPad.ele)
                resultPad.destroy();
            resultPad.show( render )
        }
    };

    var toggleResultPad = function() {
        if (resultPad) {
            if (resultPad.ele) {
                resultPad.destroy();
            } else {
                showList();
            }
        }
    };
    return {
        showList        :   showList,
        toggleResultPad :   toggleResultPad
    };

}());

friendManager.getMapPlace = function(map){
    return {
	zoom : map.getZoom() ,
	point : map.getCenter()
    };
}
friendManager.panTo = function( map , point ){
    map.panTo( new ScheduleTourMap.Point( point.lng , point.lat ) )
}
friendManager.configureButton = function( map ){
    console.log( "friendManager.configureButton" )
    $('.favbtn').each( function(ind , ele ){
	var lng = $(ele).attr("lng")
	var lat = $(ele).attr("lat")
	var position = $(ele).attr("position") 
	console.log ( [ lng , lat ] )
	if ( friendManager.find( lng , lat )===null ){
	    $(ele).html('<button class="btn-primary" onclick="javascript:friendManager.add(\''
	    +position+'\','
		+lng+','+lat+','+map.getZoom()+')"><i class="icon-xlarge icon-star"></i></button>')
	    console.log( "not in fav" )
	}else $(ele).html('<button class="btn" onclick="javascript:friendManager.remove('
		+lng+','+lat+')"><i class="icon-xlarge icon-star-empty"></i></button>')
    })
}
friendManager.panToLoc = function( index ){
    if ( index < 0 || index >= friendManager.places.length )
	console.log( "out of bound error" )
    else{
	var pl = friendManager.places[ index ]
	var loc = new ScheduleTourMap.Point( pl.point.lng , pl.point.lat )
	ScheduleTour.panTo( loc )
    }
}

