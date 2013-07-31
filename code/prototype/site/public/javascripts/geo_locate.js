mygeolocate = {}

mygeolocate.myLocationMarker = null;
mygeolocate.panTo = function(map){
    map.panTo(mygeolocate.myLocationPoint);
}
/*
var icon = new BMap.Icon('/images/point.png',new BMap.Size(40, 40),{
    anchor: new BMap.Size(20, 20) , 
    infoWindowAnchor: new BMap.Size(40, 40)
})
*/
mygeolocate.locate = function( map ) {
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
        },function(err){console.log(err)},{enableHighAccuracy: true})
    }

mygeolocate.locate = function( map ) {
        console.log("mygeolocate.locate")
        var geolocation = navigator.geolocation;
        geolocation.getCurrentPosition(function(res) {
            console.log("geolocation.getCurrentPosition callback")
            var latLng = new google.maps.LatLng( res.coords.longitude , res.coords.latitude )
            mygeolocate.myLocationPoint = latLng;
            var mk = new google.maps.Marker({
                map:map,
                position: latLng,
                icon: '/images/point.png'
            });
            map.panTo(latLng);
            //map.setZoom(14);
            console.log('Your Position:'+pt.lng+','+pt.lat);
            // store location
            mygeolocate.myLocationMarker =  mk ;
        },function(err){console.log(err)},{enableHighAccuracy: true})
    }
mygeolocate.watchlocate = function( map ){
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
    } ,function(err){} , {enableHighAccuracy: true})
}

mygeolocate.watchlocate = function( map ){
    var geolocation = navigator.geolocation;
    mygeolocate.watchID = geolocation.watchPosition( function relocate( res ){
        try{
            var x = res.coords.latitude
            var y = res.coords.longitude
            //x += 0.1
            //y += 0.1
            //map.removeOverlay( mygeolocate.myLocationMarker )
            var latLng = new google.maps.LatLng( x , y )
            console.log( latLng )
            if (!mygeolocate.myLocationMarker){
                mygeolocate.myLocationMarker = new google.maps.Marker({
                    map: map,
                    position:latLng,
                    icon: '/images/point.png'
                    })
            }
            mygeolocate.myLocationMarker.setPosition( latLng )
            mygeolocate.myLocationPoint = latLng;
            if (locationLock)
                map.panTo( latLng );

        }catch(err){ console.log(err) }
    } ,function(err){} , {enableHighAccuracy: true})
}
mygeolocate.remove_watchlocate = function(){
    var geolocation = navigator.geolocation;
    geolocation.clearWatch(mygeolocate.watchID)
}
//$(document).ready(function(){
    //    $.getScript('/javascripts/baiduPosConverter.js')
    // original BMap.Converter is deprecated
//})
