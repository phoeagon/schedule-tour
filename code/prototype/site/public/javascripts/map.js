
var Event =  {
    createEvent :   function(p) {
        var e = {};
        e.user = null;
        e.title = null;
        e.position = p;
        e.from = null;
        e.until = null;
        e.description = null;
        e.alarams = null;
        e.privacy = null;
        e.weight = null;
        e.finish = null;
        e.addTime = new Date();
        return e;
    }
};

$(document).ready(function () {

    $("#sidebar_btn").click(function () {
        $("#sidebar").toggleClass("hidden");
    });
    $("#classic_btn").click(function () {
        $("#classic").toggleClass("hidden");
    });

    //==================================================
    //Map related logic
    var map = new BMap.Map("map");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point,15);

    //enable zoom by mouse wheel
    map.enableScrollWheelZoom();


    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            var mk = new BMap.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            alert('您的位置：'+r.point.lng+','+r.point.lat);
            map.centerAndZoom(r, 14);
        }
        else {
            alert('failed'+this.getStatus());
        }        
    },{enableHighAccuracy: true})

    //nav bar
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}));
    map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT, type: BMAP_NAVIGATION_CONTROL_PAN}));
    map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM}));

    //mark point
    var marker1 = new BMap.Marker(new BMap.Point(116.384, 39.925));
    map.addOverlay(marker1);

    //info window for mark point
    var infoWindow1 = new BMap.InfoWindow("普通标注");
    marker1.addEventListener("click", function() {
        this.openInfoWindow(infoWindow1);
    });

    //==================================================
    //events to save all events
    var events = [];
    //walkings to save all path generated by map api
    var walkings = [];
    //STUB: fetch event data from server
    //
    //add event listener
    var addEvent = function (p) {
        //add marker to map
        var marker = new BMap.Marker(p), px = map.pointToPixel(p);
        map.addOverlay(marker);
        //create an Event Object
        var e = Event.createEvent(p);
        //add the event to events
        events.push(e);
        //sort by addTime
        //THIS NEEDS TO BE IMPLEMENTED BY ANOTHER WAY
        events.sort(function (x, y) {
            return x.addTime - y.addTime;
        });
        //clear previous paths
        walkings = [];
        //generate new paths
        for (i=0; i<events.length-1; ++i) {
            var walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: false}});
            var from = events[i].position;
            var to = events[i+1].position;
            walking.search(from, to);
            walkings.push(walking);
        }
    }


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
        text:'放置到最大级',
        callback:function(){map.setZoom(18)}
    },
    {
        text:'查看全国',
        callback:function(){map.setZoom(4)}
    },
    {
        text:'在此添加标注',
        callback: addEvent
    }];


    for(var i=0; i < txtMenuItem.length; i++){
        contextMenu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
        if(i==1 || i==3) {
            contextMenu.addSeparator();
        }
    }
    map.addContextMenu(contextMenu);



});
