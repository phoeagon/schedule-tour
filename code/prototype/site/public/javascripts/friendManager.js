//require jQuery

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
                        name    :   x,
                        online  :   null,
                        position:   null
                    });
                });
                //friendManager.configureButton( ScheduleTour.getMap() )
                safeCb(callback)();
            });
        };

        var removeFriend = function(target) {
            $.post('/friends/del',
                {target : target},
                function(data) {
                    console.log( data )
                    if (data.code=='OK'){
                        alert("successful")
                        friendManager.getFriends()
                        //friendManager.configureButton( ScheduleTour.getMap() )
                        return true;
                    }
                    alert("remove friend failed");
                    return false;
                }
            );
        };

        var addFriend = function(target) {
            $.post('/friends/add',
                {target : target},
                function(data) {
                    console.log( data )
                    if (data.code=='OK'){
                        alert("successful")
                        friendManager.getFriends()
                        //friendManager.configureButton( ScheduleTour.getMap() )
                        return true;
                    }
                    alert("remove friend failed");
                    return false;
                }
            );
        };

        return {
            get :   getFriends,
            add :   addFriend,
            del :   removeFriend
        };
    }());

    var showList = function() {
        remoteFriends.get(renderList);
    };

    var renderList = function() {
        var render = [];
        render.push({
            title   :   'Toolbox',
            content :   
                $('<div>').append(
                    $('<input>')
                ).append(
                    $('<button>')
                ).html()
        });
        friends.map(function(x) {
            render.push({
                title: x.name,
                content:
                $("<div>").append(
                    $("<p>").html(x.name)
                ).append(
                    $("<a>").addClass("btn btn-primary").attr("href","javascript:void(0);").html("Locate")
                ).append(
                    $("<a>").addClass("btn btn-default").attr("href","javascript:void(0);").html("Call")
                ).append(
                    $("<div>").addClass('message-div') 
                ).append(
                    $("<div>").addClass('call-div') 
                ).html()
            });
        });
        if ( resultPad ){
            if (resultPad.ele)
                resultPad.destroy();
            resultPad.show( render )
        }
    };

    return {
        showList    :   showList
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
friendManager.add = function( title , lng , lat , zoom ){
    var obj = {
	title : unescape( title ) ,
	point : { lng : lng , lat : lat } ,
	zoom  : zoom
    }
    friendManager.savePlace( obj )
}
friendManager.remove = function( lng , lat ){
    console.log( "friendManager.remove" )
    console.log( [ lng , lat ] )
    for ( var x in friendManager.places ){
	var ele = friendManager.places[x];
//	console.log( [ ele.point.lng , ele.point.lat ] )
	if ( ele.point.lng == lng && ele.point.lat == lat ){
	    console.log ( ele )
	    friendManager.removePlace( ele )
	    break
	}
    }
}
friendManager.find = function ( lng , lat ){
    console.log ( "friendManager.find" )
    for ( var x in friendManager.places ){
	var ele = friendManager.places[x];
	if ( ele.point.lng == lng && ele.point.lat == lat ){
	    console.log ( ele )
	    return x;
	}
    }
    //alert(" Not found!" )
    return null;
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
friendManager.toggleResultPad = function(){
    if ( resultPad ){
	if (resultPad.ele)
	    resultPad.destroy();
	else friendManager.showList();
    }
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

friendManager.removeLoc = function( index ){
    if ( index < 0 || index >= friendManager.places.length )
	console.log( "out of bound error" )
    else{
	friendManager.removePlace( friendManager.places[index] );
	friendManager.places.splice( index , 1 )
	$( '.result_item_'+index ).remove()
    }
}
