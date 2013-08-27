// example: CardManager.weather( ScheduleTour.getMap().getCenter() )

CardManager = function ( divId ){
    if ( divId && divId[0]!=='#' )
        divId = '#'+divId;
    if ( divId )
        this.divId = divId;
    else this.divId = '#loc_card';
    return this;
}
CardManager.prototype.weather = function( loc ){
    var _divId = this.divId;
    codeLatLng( loc.lat() , loc.lng() , function( c_name ){
        //$('#loc_card').empty().append(
        //    $('<h1>').html( c_name ) );
        console.log( c_name + " weather" )
        console.log( _divId )
        if ( flight_info )
            flight_info.getinfo( 'weather+'+c_name , function(html){
                $( _divId ).html( html )
            } )
    } )
}
function codeLatLng(lat, lng , callback ) {
    var latlng = new ScheduleTourMap.Point(lat, lng);
    if (!google.maps)
        { console.log('google.maps not loaded');return;}
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': latlng}, function(results, status) {
    //console.log( [results , status] )
      if (status == google.maps.GeocoderStatus.OK) {
      console.log(results)
        if (results[1]) {
        //find country name
             for (var i=0; i<results[0].address_components.length; i++) {
            for (var b=0;b<results[0].address_components[i].types.length;b++) {

            //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                if (results[0].address_components[i].types[b] == "locality") {
                    //this is the object you are looking for
                    city= results[0].address_components[i];
                    break;
                }
            }
        }
        //city data
        callback ( city.short_name ,  city.long_name )

        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }
$(window).load( function(){
    var divId = '#loc_card';
    cardManager = new CardManager( divId );
    setInterval( function(){
        cardManager.weather( map.getCenter() );
    } , 1000*60*60 /*an hour*/ );
    $( divId ).draggable({containment: "body", scroll: false});
    var map = ScheduleTour.getMap();
    google.maps.event.addListener(map, 'idle', function(){
        console.log(" idle CB");
        if ( map.getZoom() >= 14 ){
            $( divId ).removeClass('displaynone');
            cardManager.weather( map.getCenter() )
        }else{
            $( divId ).addClass('displaynone');
        }
    });
    } );
