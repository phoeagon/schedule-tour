// example: CardManager.weather( ScheduleTour.getMap().getCenter() )

CardManager = {};
CardManager.weather = function( loc ){
    codeLatLng( loc.lat() , loc.lng() , function( c_name ){
        //$('#loc_card').empty().append(
        //    $('<h1>').html( c_name ) );
        console.log( c_name + " weather" )
        if ( flight_info )
            flight_info.getinfo( 'weather+'+c_name , function(html){
                $('#loc_card').html( html )
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
$(document).ready( function(){
    $('#loc_card').draggable();
    } );
