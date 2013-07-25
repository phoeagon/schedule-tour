var GoogleMap = (function() {
    var map = null;

    this.LatLng = (function() {
        
        return {
        };
    }());

    this.Marker = (function() {
        return {
        };
    }());

    var getMap = function() {
        return map;
    }

    var newLatLng = function(lat, lng) {
        return google.maps.LatLng(lat, lng);
    };

    var initMap = function(mapDOM) {
        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(-34.397, 150.644),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(mapDOM, mapOptions);
        return this;
    };

    var bindLongPress = function(time, callback) {
        var timer = null;
        google.maps.event.clearListener(map, "mousedown");
        google.maps.event.addListener(map, "mousedown", function(event){
            contextMenu.hide();
            timer = setTimeout(function(){
                callback(event.latLng);
            }, time);
        });
        google.maps.event.addListner(map, 'mouseup', function(event) {
            clearTimeout(timer);
        });
    };

    var addMarkerToMap = function(myLatLng, title) {
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: title
        });
        return marker;
    };

    var addInfoWindowToMarker = function(marker, contentString, maxWidth) {
        var infowindow = new google.maps.InfoWindow({
            content: contentString
            //,maxWidth: 200
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
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
