mygeolocate = {}

mygeolocate.myLocationMarker = null;
mygeolocate.panTo = function(map){
    function cb(){
        if ( mygeolocate.myLocationPoint )
            map.panTo(mygeolocate.myLocationPoint);
        else setTimeout( cb , 100 );
    }
    setTimeout( cb , 100 )
            
}
/*
var icon = new BMap.Icon('/images/point.png',new BMap.Size(40, 40),{
    anchor: new BMap.Size(20, 20) , 
    infoWindowAnchor: new BMap.Size(40, 40)
})
*/
/*mygeolocate.locate = function( map ) {
        console.log("mygeolocate.locate")
        var geolocation = navigator.geolocation;
        geolocation.getCurrentPosition(function(res) {
            console.log("geolocation.getCurrentPosition callback")
            res.point = new BMap.Point( res.coords.longitude , res.coords.latitude )
            BMap.Convertor.translate(res.point,0,function(pt){
                mygeolocate.myLocationPoint = pt;
                var mk = new BMap.Marker(pt, {icon : icon });
                map.addOverlay(mk);
                map.panTo(pt);
                console.log('Your Position:'+pt.lng+','+pt.lat);
                map.centerAndZoom(res, 14);
                // store location
                mygeolocate.myLocationMarker =  mk ;
            })
        },handleNoGeolocation,{enableHighAccuracy: true})
    }*/

mygeolocate.locate = function( map , callback ) {
        console.log("mygeolocate.locate")
        var geolocation = navigator.geolocation;
        var map = ScheduleTour.getMap();
        if (!geolocation){
            handleNoGeolocation(false);
            return;
        }
        geolocation.getCurrentPosition(function(res) {
            console.log("geolocation.getCurrentPosition callback")
            var latLng = new google.maps.LatLng( res.coords.latitude , res.coords.longitude )
            mygeolocate.myLocationPoint = latLng;
            var mk = new google.maps.Marker({
                map:map,
                position: latLng,
                content: 'Location found using HTML5.',
                icon: '/images/mylocation.png'
            });
            map.panTo(latLng);
            map.setZoom(14);
            console.log('Your Position:'+latLng.lng()+','+latLng.lat());
            // store location
            mygeolocate.myLocationMarker =  mk ;
            if (callback) callback(latLng);

        },function(err){console.log(err)},{enableHighAccuracy: true})
    }
/*mygeolocate.watchlocate = function( map ){
    var geolocation = navigator.geolocation;
    mygeolocate.watchID = geolocation.watchPosition( function relocate( res ){
        try{
            var x = res.coords.latitude
            var y = res.coords.longitude
            //x += 0.1
            //y += 0.1
            //map.removeOverlay( mygeolocate.myLocationMarker )
            var gpspt = new BMap.Point( y , x )
            BMap.Convertor.translate(gpspt,0,function(pt){
                console.log( pt )
                if (!mygeolocate.myLocationMarker){
                    mygeolocate.myLocationMarker = new BMap.Marker(pt,{icon : icon })
                    map.addOverlay( mygeolocate.myLocationMarker )
                }
                mygeolocate.myLocationMarker.setPosition( pt )
                mygeolocate.myLocationPoint = pt;
                if (locationLock) {
                    map.panTo( pt );
                    map.setZoom(15);
                }
            })
        }catch(err){ console.log(err) }
    } ,handleNoGeolocation , {enableHighAccuracy: true})
}*/

mygeolocate.watchlocate = function( map , callback ){
    var geolocation = navigator.geolocation;
    if (!geolocation){
        handleNoGeolocation(false);
        return;
    }
    mygeolocate.watchID = geolocation.watchPosition( function relocate( res ){
        try{
            var map = ScheduleTour.getMap();
            var x = res.coords.latitude
            var y = res.coords.longitude
            //x += 0.1
            //y += 0.1
            //map.removeOverlay( mygeolocate.myLocationMarker )
            var latLng = new google.maps.LatLng( x , y )
            console.log( 'watch locate : ' + latLng )
            if (!mygeolocate.myLocationMarker){
                mygeolocate.myLocationMarker = new ScheduleTourMap.Marker({
                    map: map,
                    position:latLng,
                    content: 'Location found using HTML5.',
                    icon: '/images/mylocation.png'
                    })
            }
            mygeolocate.myLocationMarker.setPosition( latLng )
            mygeolocate.myLocationPoint = latLng;
            if (locationLock)
                map.panTo( latLng );
            callback( latLng );

        } catch (err) {
            console.log(err);
        }
    } ,handleNoGeolocation , {enableHighAccuracy: true})
}
mygeolocate.remove_watchlocate = function(){
    var geolocation = navigator.geolocation;
    geolocation.clearWatch(mygeolocate.watchID)
}
//$(document).ready(function(){
    //    $.getScript('/javascripts/baiduPosConverter.js')
    // original BMap.Converter is deprecated
//})
    function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var options = {
            map: map,
            position: new google.maps.LatLng(60, 105),
            content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }
