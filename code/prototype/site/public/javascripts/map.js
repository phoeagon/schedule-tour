
var Event = (function() {
    var createEvent = function(p) {
        var e = {};
        e.user = null;
        e.title = '';
        e.place = '';
        e.position = [p.lng, p.lat];
        e.time = $("#dateFrom").datetimepicker("getDate");
        e.endTime = $("#dateUntil").datetimepicker("getDate");
        e.description = document.getElementById('description').value;
        e.alarams = null;
        e.privacy = null;
        e.weight = $("#weight").slider("value");
        e.finish = null;
        e.addTime = new Date();

        $(".datepicker").datetimepicker();
        $(".slider").slider();
        return e;
    };

    var fetchAllEvents = function(callback) {
        $.get('/event/all', function(res) {
            callback(JSON.parse(res));
        });
    }

    var saveEvent = function(newEvent, callback) {
        $.post('/event/new', newEvent, function(res) {
            callback(JSON.parse(res));
        });
    }

    var updateEvent = function(newEvent, callback) {
        $.post('/event/update', newEvent, function(res) {
            callback(JSON.parse(res));
        });
    }

    var removeEvent = function(event_id, callback) {
        $.post('/event/remove', {_id: event_id}, function(res) {
            callback(JSON.parse(res));
        });
    }

    return {
        createEvent         :   createEvent,
        fetchAllEvents      :   fetchAllEvents,
        saveEvent           :   saveEvent,
        updateEvent         :   updateEvent,
        removeEvent         :   removeEvent
    };
}());

function setSlidingMap() {
    var mapdiv = document.getElementById('map');
    var calend = document.getElementById('calendar');
    mapdiv.style.top = '0px';
    mapdiv.style.left = '0px';
    $("#map").css({'box-shadow':'15px 15px 15px 15px #000000;', 
		      '-webkit-box-shadow':'15px 15px 15px 15px #000000'});

    var calHeight = '90%';
    var calAnimationTime = '300ms';
    var sideWid = '90%';
    var sideAnimationTime = '300ms';
    
    function showCal() {
        $("#map").css({'transition':'top '+calAnimationTime, '-webkit-transition':'top'+calAnimationTime});
        mapdiv.style.top = calHeight;
        var btn = $("#classic_btn");
        btn.addClass('extended');
        //$('#map').addClass('top_collapse');
        btn.text('△');
        $("#calendar").removeClass('hidden');
        btn.unbind('click');
        btn.bind('click', hideCal);
        $("#sidebar_btn").unbind('click');
        $("#setting_show_button").addClass('visibilityhidden');
	$('.fc-button-agendaDay').click();
	$('.fc-button-today').click();
    }
    function hideCal() {
        $("#map").css({'transition':'top '+calAnimationTime, '-webkit-transition':'top'+calAnimationTime});
        mapdiv.style.top = '0px'; 
        var btn = $("#classic_btn");
        btn.removeClass('extended');
        //$('#map').removeClass('top_collapse');
        btn.text('▽');
        $("#calendar").addClass('hidden');
        btn.unbind('click');
        btn.bind('click', showCal);
        $("#sidebar_btn").bind('click', showSide);
        $("#setting_show_button").removeClass('visibilityhidden');
    }

    function showSide() {
        $("#map").css({'transition':'left '+sideAnimationTime, '-webkit-transition':'left '+sideAnimationTime});
        mapdiv.style.left = sideWid;
        var btn = $("#sidebar_btn");
        btn.addClass('extended');
        btn.text('◁');
        $("#sidebar").removeClass('back');
        btn.unbind('click');
        btn.bind('click', hideSide);
        $("#classic_btn").unbind('click');
    }
    function hideSide() {
        $("#map").css({'transition':'left '+sideAnimationTime, '-webkit-transition':'left '+sideAnimationTime});
        mapdiv.style.left = '0px'; 
        var btn = $("#sidebar_btn");
        btn.removeClass('extended');
        btn.text('▷');
        $("#sidebar").addClass('back');
        btn.unbind('click');
        btn.bind('click', showSide);
        $("#classic_btn").bind('click', showCal);
    }

    $("#calendar").addClass('hidden');
    $("#sidebar").removeClass('hidden');
    $("#sidebar").addClass('back');
    $("#classic_btn").bind('click', showCal);
    $("#sidebar_btn").bind('click', showSide);
    $("#side_collapse").bind('click', hideSide);
}

var markerOnDragStart = function(event) {
    var deleteIconMarker = new BMap.Icon('/images/DeleteIcon.jpg', new BMap.Size(10,10), null);
    map.addOverlay(deleteIconMarker);

};

var markerOnDragEnd = function(event) {
    if (event.pixel)
    drawRoute(map, events, polylines);

};

var markerOnDraging= function() {
    drawRoute(map, events, polylines);
};

var ScheduleTour = (function() {
    globalEventCache = {};
    //map of baidu
    var map = null;
    //events to save all events
    var events = [];
    //polylines to save all path
    var polylines = [];

    var geolocate = function() {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(res) {
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var mk = new BMap.Marker(res.point);
                map.addOverlay(mk);
                map.panTo(res.point);
                console.log('Your Position:'+res.point.lng+','+res.point.lat);
                map.centerAndZoom(res, 14);
            }
            else {
                alert('failed'+this.getStatus());
            }
        },{enableHighAccuracy: true})
    }
   $(document).ready(function(){ $('#geoloc_btn').click( geolocate ); });
    
    var initMap = function(id) {
        map = new BMap.Map(id);
        var point = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(point, 15);
        //enable zoom by mouse wheel
        map.enableScrollWheelZoom();
        //nav bar
        map.addControl(new BMap.NavigationControl());
        addContentMenu(addEvent);
    }

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

    var newMarkerToEvent = function(map, e) {
        //create marker
        var marker = new BMap.Marker(new BMap.Point(e.position[0], e.position[1]));
        //add marker to map
        map.addOverlay(marker);
        //attach marker to event
        e.marker = marker;
        return e;
    }

    var fetchEventsFromServer = function() {
        //TODO: disable the button of adding event
        Event.fetchAllEvents(function(res) {
            if (res.code != "OK") {
                console.log("should log in");
                window.location = '/login';
                return;
            }
	    globalEventCache = res.eventEntries		//global
	    console.log( globalEventCache )
            var eventsBuff = res.eventEntries;
            for(var i = 0; i < eventsBuff.length; i++) {
                events.push(newMarkerToEvent(map, eventsBuff[i]));
            }
            tour(events);
            drawRoute(map, events, polylines);
            //TODO: enable the button of adding event
        });
    }

    
    var enableLongPress = function(longPressCallback) {
        map.addEventListener('longpress', longPressCallback);
        //map.addEventListener('longpress', function(e) { addEvent(e.point); });
    }

    //setSlidingMap();

    var addRecommendation = function() {
        recommend_douban(map);
    }

    //add event listener
    var addEvent = function (p) {
        //add marker to map
        var marker = new BMap.Marker(p);
        var px = map.pointToPixel(p);
        map.addOverlay(marker);
        //create an Event Object
        $("#addEventButt").unbind('click');
        $(".datepicker").datetimepicker();
        $(".slider").slider();
	document.getElementById('description').value = '';
	$('#weight').slider('value', 0);
	$('#dateFrom').datetimepicker('setDate', new Date());
	$('#dateUntil').datetimepicker('setDate', new Date());
        $("#sidebar_btn").click();
        //add the event to events
        $("#addEventButt").bind('click', function() {
            var newEvent = {
                title       :   'title',
                description :   $('#description').val(),
                place       :   '',
                weight      :   $('#weight').slider('value'),
                time        :   $('#dateFrom').datetimepicker('getDate'),
                endTime     :   $('#dateUntil').datetimepicker('getDate'),
                duration    :   0,
                position    :   [p.lng, p.lat],
                privacy     :   false,
                addTime     :   new Date(),
                finish      :   false,
                alarms      :   []
            };

            $("#sidebar_btn").click();
            Event.saveEvent(newEvent, function(res){
                console.log(res);
                newEvent._id = res._id;
            });
            newEvent.marker = marker;
            events.push(newEvent);
            tour(events);
            drawRoute();
            if (calendarRenderer)
                calendarRenderer.refresh();
        });
    }

    //remove event listener
    var removeEvent = function (_id) {
        //add marker to map
        var index = 0;
        for (index=0; index<events.length; ++index) {
            if (_id === events[index]._id) break;
        }
        if (index === events.length) return;

        var marker = events[index].marker;
        if (marker === null) return;
        map.removeOverlay(marker);
        //create an Event Object
        Event.removeEvent(_id, function(res){
            console.log(res);
        });
        events.splice(index, 1);
        tour(events);
        drawRoute();
	if (calendarRenderer)
	    calendarRenderer.refresh();
    }

    var drawRoute = function() {
        //remove old paths
        for (var i=0; i<polylines.length; ++i) {
            map.removeOverlay(polylines[i]);
        }
        polylines.splice(0);
        console.log(events);
        //generate new paths
        for (var i=0; i<events.length-1; ++i) {
            var walking = new BMap.WalkingRoute(map);
            var from = new BMap.Point(events[i].position[0], events[i].position[1]);
            var to = new BMap.Point(events[i+1].position[0], events[i+1].position[1]);
            walking.setSearchCompleteCallback(function(res){
                console.log(res);
                var path = res.getPlan(0).getRoute(0).getPath();
                var polyline = new BMap.Polyline(path, {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});
                map.addOverlay(polyline);
                polylines.push(polyline);
            });
            walking.search(from, to);
        }
    }

    return {
        initMap                 :   initMap,
        geolocate               :   geolocate,
        fetchEventsFromServer   :   fetchEventsFromServer,
        drawRoute               :   drawRoute,
        removeEvent             :   removeEvent,
        addEvent                :   addEvent
    };

}());

$(document).ready(function () {

    ScheduleTour.initMap("map");
    ScheduleTour.geolocate();
    ScheduleTour.fetchEventsFromServer();

    function newMarkerWithDeleteBtn(theMap, point, e, index) {
        var marker = new BMap.Marker(point);
        theMap.addOverlay(marker);
        var btnID = 'deleter'+index;
        var infoContent = 
            "<h4>"+e.title+"</h4>"+
            "<h5>"+"Start Time:"+e.time+"</h5>"+
            "<h5>"+"End Time:"+e.endTime+"</h5>"+
            "<p>"+e.description+"</p>"+
            "<button id=\""+btnID+"\">Delete</button>";
        var infoWindow = new BMap.InfoWindow(infoContent);
        $(btnID).bind('click', function() {
            events.splice(index, 1);
        });
        marker.addEventListener('click', function() {
            this.openInfoWindow(infoWindow);
        });
    }
    
    //map.addEventListener('longpress', function(e) { addEvent(e.point); });

    setSlidingMap();

    //recommend_douban(map);
});
