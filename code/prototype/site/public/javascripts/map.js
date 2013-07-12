
var Event =  {
createEvent :   function(p, marker) {
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
	var content = "<div id='add_event_gesture_dialog' class='add_event_gesture_dialog' title='Adding Event'>"+
      "<form>"+
        "Start date:<input type='text' class='datepicker' name='start_date'/> <br/>"+
        "End Date:<input type='text' class='datepicker' name='end_date'/> <br/>"+
        "Type: <input type='radio' name='routine' value='routine'>Routine"+
        "<input type='radio' name='routine' value='once'>Once <br/>"+
        "Priority: <div type='text' class='slider' name='priority'/> </div><br/>"+
	"Note: <textarea name='add-event-note'></textarea>"+
      "</form>"+
"</div>";
	var infoWindow = new BMap.InfoWindow(content);
	marker.addEventListener('click', function() { this.openInfoWindow(infoWindow) });
	$(".datepicker").datepicker();
        return e;
    }
};

function setSlidingMap() {
    var mapdiv = document.getElementById('map');
    var calend = document.getElementById('calendar');
    mapdiv.style.top = '0px';
    mapdiv.style.left = '0px';
    $("#map").css({'box-shadow':'15px 15px 15px 15px #000000;', 
		      '-webkit-box-shadow':'15px 15px 15px 15px #000000'});

    var calHeight = '500px';
    var calAnimationTime = '1000ms';
    var sideWid = '200px';
    var sideAnimationTime = '500ms';
    
    function showCal() {
	$("#map").css({'transition':'top '+calAnimationTime, '-webkit-transition':'top'+calAnimationTime});
	mapdiv.style.top = calHeight;
	var btn = $("#classic_btn");
	btn.css({'top':calHeight});
	btn.text('^');
	$("#calendar").removeClass('hidden');
	btn.unbind('click');
	btn.bind('click', hideCal);
	$("#sidebar_btn").unbind('click');
    }
    function hideCal() {
	$("#map").css({'transition':'top '+calAnimationTime, '-webkit-transition':'top'+calAnimationTime});
	mapdiv.style.top = '0px'; 
	var btn = $("#classic_btn");
	btn.css({'top':'0px'});
	btn.text('V');
	$("#calendar").addClass('hidden');
	btn.unbind('click');
	btn.bind('click', showCal);
	$("#sidebar_btn").bind('click', showSide);
    }

    function showSide() {
	$("#map").css({'transition':'left '+sideAnimationTime, '-webkit-transition':'left '+sideAnimationTime});
	mapdiv.style.left = sideWid;
	var btn = $("#sidebar_btn");
	btn.css({'left':sideWid});
	btn.text('<');
	$("#sidebar").removeClass('hidden');
	btn.unbind('click');
	btn.bind('click', hideSide);
	$("#classic_btn").unbind('click');
    }
    function hideSide() {
	$("#map").css({'transition':'left '+sideAnimationTime, '-webkit-transition':'left '+sideAnimationTime});
	mapdiv.style.left = '0px'; 
	var btn = $("#sidebar_btn");
	btn.css({'left':'0px'});
	btn.text('>');
	$("#sidebar").addClass('hidden');
	btn.unbind('click');
	btn.bind('click', showSide);
	$("#classic_btn").bind('click', showCal);
    }
    
    $("#calendar").addClass('hidden');
    $("#classic_btn").bind('click', showCal);
    $("#sidebar_btn").bind('click', showSide);
}

$(document).ready(function () {

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
        var e = Event.createEvent(p, marker);
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

    setSlidingMap();
});
