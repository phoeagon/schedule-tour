mygeolocate = {}

mygeolocate.myLocationMarker = null;
mygeolocate.panTo = function(map){
    map.panTo(mygeolocate.myLocationPoint);
}
mygeolocate.locate = function( map ) {
        console.log("mygeolocate.locate")
        var geolocation = navigator.geolocation;
        geolocation.getCurrentPosition(function(res) {
            console.log("geolocation.getCurrentPosition callback")
            res.point = new BMap.Point( res.coords.longitude , res.coords.latitude )
            BMap.Convertor.translate(res.point,0,function(pt){
                mygeolocate.myLocationPoint = pt;
                var mk = new BMap.Marker(pt);
                map.addOverlay(mk);
                map.panTo(pt);
                console.log('Your Position:'+pt.lng+','+pt.lat);
                map.centerAndZoom(res, 14);
                // store location
                mygeolocate.myLocationMarker =  mk ;
            })
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
                    mygeolocate.myLocationMarker = new BMap.Marker(pt)
                    map.addOverlay( mygeolocate.myLocationMarker )
                }
                mygeolocate.myLocationMarker.setPosition( pt )
                mygeolocate.myLocationPoint = pt;
                //map.panTo( pt );
            })
        }catch(err){ console.log(err) }
    } ,function(err){} , {enableHighAccuracy: true})
}
mygeolocate.remove_watchlocate = function(){
    var geolocation = navigator.geolocation;
    geolocation.clearWatch(mygeolocate.watchID)
}
$(document).ready(function(){
    $.getScript('http://developer.baidu.com/map/jsdemo/demo/convertor.js')
    // original BMap.Converter is deprecated
})
