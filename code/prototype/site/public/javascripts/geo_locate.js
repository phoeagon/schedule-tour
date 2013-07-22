mygeolocate = {}

mygeolocate.myLocationMarker = {};
mygeolocate.locate = function( map ) {
        mygeolocate.geolocation = new BMap.Geolocation();
        var geolocation = mygeolocate.geolocation;
        geolocation.getCurrentPosition(function(res) {
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var mk = new BMap.Marker(res.point);
                map.addOverlay(mk);
                map.panTo(res.point);
                console.log('Your Position:'+res.point.lng+','+res.point.lat);
                map.centerAndZoom(res, 14);
                // store location
                mygeolocate.myLocationMarker =  mk ;
            }
            else {
                alert('failed'+this.getStatus());
            }
        },{enableHighAccuracy: true})
    }
mygeolocate.watchlocate = function( map ){
    var geolocation = navigator.geolocation;
    mygeolocate.watchID = geolocation.watchPosition( function relocate( res ){
        try{
            var x = res.coords.latitude
            var y = res.coords.longitude
            //x += 0.1
            //y += 0.1
            map.removeOverlay( mygeolocate.myLocationMarker )
            var gpspt = new BMap.Point( y , x )
            BMap.Convertor.translate(gpspt,0,function(pt){
                console.log( pt )
                map.addOverlay( 
                    mygeolocate.myLocationMarker = new BMap.Marker( pt )
                    )
                map.panTo( pt );
            })
        }catch(err){ alert(err) }
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
