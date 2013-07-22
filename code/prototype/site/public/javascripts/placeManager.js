placeManager = {};

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
    })
}
placeManager.savePlace = function( obj ){
    $.post('/saved.places/new',obj,function(data){
	if (data.code=='OK')
	    return true;
	return false;
    })
}
placeManager.removePlace = function( obj ){
    $.getJSON('/saved.place/remove' , obj , function(data){
	if (data.code=='OK')
	    return true;
	return false;
    })
}
placeManager.panTo = function( map , point ){
    map.panTo( new BMap.Point( point.lng , point.lat ) )
}
