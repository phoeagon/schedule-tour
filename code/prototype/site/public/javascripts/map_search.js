mapSearch = {};
mapSearch.search = function( map , searchFor ){
    if ( flight_info )
        if ( flight_info.test(searchFor) )
            flight_info.lookup( 'flight+status+check+'+searchFor );
    try{
    var placeService = new google.maps.places.PlacesService(map);
    var searchRequest = {
        location    :   map.getCenter(),
        keyword    :   searchFor,
        query       :   searchFor,
        radius      :   500000
    };
    //placeService.nearbySearch(searchRequest, callback);
    placeService.textSearch(searchRequest, callback);
    var infoWindow = new google.maps.InfoWindow();
    }   catch(err){
        alert( "Service temporarily unavailable!" )
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            humane.log(results.length + ' results found');
            map.setZoom(10);
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    };
    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });

        var pos = place.geometry.location;
        var infoContent = "<h4>"+place.name+"</h4>";
        infoContent = infoContent + '<p><br/><b>At this location:</b><br/>'
        infoContent = infoContent + "<span class='favbtn ' lng='"+pos.lng()+"' lat='"+pos.lat()+
            "' position='"+escape(place.name)+"' style='width:45%;display:inline-block;'></span>"
        infoContent = infoContent + "<button class='add-event-btn btn' onclick=\"javascript:ScheduleTour.addEventFromClick(new google.maps.LatLng("+pos.lat()+", "+pos.lng()+"), \'"+place.name+"\');\"  style='width:45%;'>New Event</button></p>";

        var infoWindow = new ScheduleTourMap.InfoWindow({
            content:infoContent
        });

        google.maps.event.addListener(marker, 'click', function() {
        //    infoWindow.setContent(place.name);
            infoWindow.open(map, this);
        });
    };
    /*
    var local = new BMap.LocalSearch(map, {
        renderOptions:{map: map, autoViewport:true}
    });
    console.log( local.search )
    local.search( searchFor );
    */
}
mapSearch.callback = function(){
    var str = $('#goto_place').val();
    ScheduleTourMap.userData.userLocNames.add( str );
    mapSearch.search( ScheduleTour.getMap() , $('#goto_place').val() );
}
mapSearch.setSearchBarCallback = function(){
    //fix ENTER
    $('#search_go').click( mapSearch.callback )
    $('form').bind("keydown", function(e) {
      var code = e.keyCode || e.which; 
      if (code  == 13 || code == 10 ) {
        e.preventDefault();
        mapSearch.callback();
        return false;
      }
    });
}
$(window).load(function(){
    mapSearch.setSearchBarCallback();
})
