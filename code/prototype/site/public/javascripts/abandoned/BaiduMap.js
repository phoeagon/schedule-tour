var BaiduMap = (function() {
    var map = null;

    var getMap = function() {
        return map;
    }

    var newLatLng = function(lat, lng) {
        return new BMap.Point(lng, lat);
    };

    var initMap = function(mapDOM) {
        map = new BMap.Map(mapDOM);
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
        return this;
    };

    var addMarkerToMap = function(myPoint, title) {
        var marker = new BMap.Marker(myPoint,{
            title:title
        });
        map.addOverlay(marker);
        return marker;
    };

    var addInfoWindowToMarker = function(marker, contentString, maxWidth) {
        var infoWindow = new BMap.InfoWindow(contentString);
        marker1.addEventListener("click", function(){
            this.openInfoWindow(infoWindow1);
        });
        return this;
    };

    var addContentMenu = function(addEventCallback) {
        var contextMenu = new BMap.ContextMenu();
        var txtMenuItem = [
        {
            text:'放大',
            callback:function(){map.zoomIn()}
        },
        {
            text:'缩小',
            callback:function(){map.zoomOut()}
        },
        {
            text:'在此添加标注',
            callback: addEventCallback
        }];

        for(var i=0; i < txtMenuItem.length; i++){
            contextMenu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
            if (i==1) contextMenu.addSeparator();
        }
        map.addContextMenu(contextMenu);
    }

    return {
        getMap                  :   getMap,
        newLatLng               :   newLatLng,
        initMap                 :   initMap,
        addMarkerToMap          :   addMarkerToMap,
        addInfoWindowToMarker   :   addInfoWindowToMarker,
        addContentMenu          :   addContentMenu,
        bindLongPress           :   bindLongPress
    };
}());
