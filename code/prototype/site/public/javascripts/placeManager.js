placeManager = {
    places : []
}

placeManager.getMapPlace = function(map){
    return {
	zoom : map.getZoom() ,
	point : map.getCenter()
    };
}
placeManager.places = [];
placeManager.getPlace = function(){
    placeManager.places = [];
    $.getJSON('/saved.places/list',function(data){
	for ( var x in data.places )
	    placeManager.places.push( data.places[x] )
	placeManager.configureButton( ScheduleTour.getMap() )
    })
}
placeManager.savePlace = function( obj ){
    console.log( obj )
    $.post('/saved.places/new',obj,function(data){
	try{
	    data = JSON.parse( data )
	}catch(err){
	    data = { code:"failed" }
	}
	console.log( data )
	if (data.code=='OK'){
	    alert("successful");
	    placeManager.getPlace()
	    return true;
	}
	//console.log("failed");return false;
    })
}
placeManager.removePlace = function( obj ){
    $.getJSON('/saved.places/remove' , {_id:obj._id} , function(data){
	console.log( data )
	if (data.code=='OK'){
	    alert("successful")
	    placeManager.getPlace()
	    placeManager.configureButton( ScheduleTour.getMap() )
	    return true;
	}
	alert("failed");return false;
    })
}
placeManager.panTo = function( map , point ){
    map.panTo( new ScheduleTour.Point( point.lng , point.lat ) )
}
placeManager.add = function( title , lng , lat , zoom ){
    var obj = {
	title : title ,
	point : { lng : lng , lat : lat } ,
	zoom  : zoom
    }
    placeManager.savePlace( obj )
}
placeManager.remove = function( lng , lat ){
    console.log( "placeManager.remove" )
    console.log( [ lng , lat ] )
    for ( var x in placeManager.places ){
	var ele = placeManager.places[x];
//	console.log( [ ele.point.lng , ele.point.lat ] )
	if ( ele.point.lng == lng && ele.point.lat == lat ){
	    console.log ( ele )
	    placeManager.removePlace( ele )
	    break
	}
    }
}
placeManager.find = function ( lng , lat ){
    console.log ( "placeManager.find" )
    for ( var x in placeManager.places ){
	var ele = placeManager.places[x];
	if ( ele.point.lng == lng && ele.point.lat == lat ){
	    console.log ( ele )
	    return x;
	}
    }
    //alert(" Not found!" )
    return null;
}
placeManager.configureButton = function( map ){
    console.log( "placeManager.configureButton" )
    $('.favbtn').each( function(ind , ele ){
	var lng = $(ele).attr("lng")
	var lat = $(ele).attr("lat")
	var position = $(ele).attr("position")
	console.log ( [ lng , lat ] )
	if ( placeManager.find( lng , lat )===null ){
	    $(ele).html('<button class="btn-primary" onclick="javascript:placeManager.add(\''
	    +position+'\','
		+lng+','+lat+','+map.getZoom()+')">Fav</button>')
	    console.log( "not in fav" )
	}else $(ele).html('<button class="btn" onclick="javascript:placeManager.remove('
		+lng+','+lat+')">Unfav</button>')
    })
}
placeManager.showList = function(  ){
    //this.getPlace();
    var render = [];
    for ( var ele in this.places ){
	render.push( {
	    title: this.places[ele].title ,
	    content: $("<div>").append(
		    $("<a>").attr("href","javascript:placeManager.panToLoc("+ele+");").html("Goto")
		).html()
	})
    }
    if ( resultPad ){
	if (resultPad.ele)
	    resultPad.destroy();
	resultPad.show( render )
     }
}
placeManager.toggleResultPad = function(){
    if ( resultPad ){
	if (resultPad.ele)
	    resultPad.destroy();
	else placeManager.showList();
    }
}
placeManager.panToLoc = function( index ){
    if ( index < 0 || index >= placeManager.places.length )
	console.log( "out of bound error" )
    else{
	var pl = placeManager.places[ index ]
	var loc = new ScheduleTour.Point( pl.point.lng , pl.point.lat )
	ScheduleTour.panTo( loc )
    }
}
placeManager.removeLoc = function( index ){
    if ( index < 0 || index >= placeManager.places.length )
	console.log( "out of bound error" )
    else{
	placeManager.removePlace( index );
	placeManager.places.splice( index , 1 )
    }
}
$(document).ready(function(){
    $('#fav_list_button').click( placeManager.toggleResultPad );
    placeManager.getPlace();
})
