
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
        var btn = $("#calendar_btn");
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
        $("#search_panel").addClass('hidden');
    }
    function hideCal() {
        $("#map").css({'transition':'top '+calAnimationTime, '-webkit-transition':'top'+calAnimationTime});
        mapdiv.style.top = '0px'; 
	$('#map').removeClass('disabledColor');
	$('#map_pad').removeClass('inUse');
        var btn = $("#calendar_btn");
        btn.removeClass('extended');
        //$('#map').removeClass('top_collapse');
        btn.text('▽');
        $("#calendar").addClass('hidden');
        btn.unbind('click');
        btn.bind('click', showCal);
        $("#sidebar_btn").bind('click', showSide);
        $("#setting_show_button").removeClass('visibilityhidden');
        $("#search_panel").removeClass('hidden');
    }

    function showSide() {
        $("#map").css({'transition':'left '+sideAnimationTime, '-webkit-transition':'left '+sideAnimationTime});
        mapdiv.style.left = sideWid;
	$('#map_pad').addClass('inUse');
	$('#map').addClass('disabledColor');
        var btn = $("#sidebar_btn");
        btn.addClass('extended');
        btn.text('◁');
        $("#sidebar").removeClass('back');
        btn.unbind('click');
        btn.bind('click', hideSide);
        $("#calendar_btn").unbind('click');
    }
    function hideSide() {
        $("#map").css({'transition':'left '+sideAnimationTime, '-webkit-transition':'left '+sideAnimationTime});
        mapdiv.style.left = '0px'; 
	$('#map').removeClass('disabledColor');
	$('#map_pad').removeClass('inUse');
        var btn = $("#sidebar_btn");
        btn.removeClass('extended');
        btn.text('▷');
        $("#sidebar").addClass('back');
        btn.unbind('click');
        btn.bind('click', showSide);
        $("#calendar_btn").bind('click', showCal);
    }

    $("#calendar").addClass('hidden');
    $("#sidebar").removeClass('hidden');
    $("#sidebar").addClass('back');
    $("#calendar_btn").bind('click', showCal);
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

    var geolocate = function(){
        mygeolocate.locate(map)
    }
    var panTo = function(){
        mygeolocate.panTo(map)
    }
   $(document).ready(function(){ $('#geoloc_btn').click( panTo ); });
    
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


    var addInfoWindowToEvent = function(map, e) {
        var eid = e._id;
        var pos = e.position;
        var locals = findEventByPos(pos);
        locals.push(e);
        var infoContent = "<h4>"+e.title+"</h4>"+
            "<h5>"+"Start Time:"+e.time+"</h5>"+
            "<h5>"+"End Time:"+e.endTime+"</h5>"+
            "<p>"+e.description+"</p>"+
            "<button onclick='javascript:ScheduleTour.removeEvent(\"" + e._id + "\");'>Delete</button><br/>";
        for (var i = 0; i < locals.length; i++) {
            if (locals[i]._id != eid) {
                var ee = locals[i];
                infoContent = infoContent +
                    "<h4>"+ee.title+"</h4>"+
                    "<h5>"+"Start Time:"+ee.time+"</h5>"+
                    "<h5>"+"End Time:"+ee.endTime+"</h5>"+
                    "<p>"+ee.description+"</p>"+
                    "<button class='btn' onclick='javascript:ScheduleTour.removeEvent(\"" + ee._id + "\");'>Delete</button><br/>";
            }
        }
        infoContent = infoContent + "<span class='favbtn' lng='"+pos[0]+"' lat='"+pos[1]+"'></span>"
        infoContent = infoContent + "<button class='add-event-btn btn' onclick='javascript:ScheduleTour.addEvent(new BMap.Point("+pos[0]+", "+pos[1]+"));'>Add new Event here</button>";
        var infoWindow = new BMap.InfoWindow(infoContent);
        e.marker.removeEventListener('click');
        e.marker.addEventListener('click', function() {
            this.openInfoWindow(infoWindow);
            placeManager.configureButton( map )
        });
    }
    var newMarkerToEvent = function(map, e) {
        var p = new BMap.Point(e.position[0], e.position[1]);
        var localEvents = findEventByPos(e.position);
        var marker = null;
        if (localEvents.length == 0) {
            marker = new BMap.Marker(p);
            marker.refCount = 1;
            var px = map.pointToPixel(p);
            map.addOverlay(marker);
        } else {
            marker = localEvents[0].marker;
            marker.refCount++;
        }/*
        //create marker
        var marker = new BMap.Marker(new BMap.Point(e.position[0], e.position[1]));
        //add marker to map
        map.addOverlay(marker);*/
        //attach marker to event
        e.marker = marker;
        return e;
    }

    var fetchEventsFromServer = function() {
        //TODO: disable the button of adding event
        Event.fetchAllEvents(function(res) {
            if (res.code != "OK") {
                console.log("should log in");
                return;
            }
	    globalEventCache = res.eventEntries		//global
	    //console.log( globalEventCache )
            var eventsBuff = res.eventEntries;
            for(var i = 0; i < eventsBuff.length; i++) {
                var newEvent = newMarkerToEvent(map, eventsBuff[i]);
                addInfoWindowToEvent(map, newEvent);
                events.push(newEvent);
            }
            events = tour(events);
            drawRoute(map, events, polylines);
            //TODO: enable the button of adding event
        });
    }

    
    var enableLongPress = function() {
        map.addEventListener('longpress', function(e) { addEvent(e.point); });
    }

    //setSlidingMap();

    var addRecommendation = function() {
        recommend_douban(map);
    }

    //find event by location

    var findEventByPos = function(pos) {
	var e = [];
	for (var i = 0; i < events.length; i++) {
	    if (events[i].position[0] == pos[0] && events[i].position[1] == pos[1]) {
		e.push(events[i]);
	    }
	}
	return e;
    }

    //add event listener
    var addEvent = function (p) {
        //add marker to map
        var localEvents = findEventByPos([p.lng, p.lat]);
	var marker = null;
	if (localEvents.length == 0) {
	    marker = new BMap.Marker(p);
	    marker.refCount = 1;
	    var px = map.pointToPixel(p);
	    map.addOverlay(marker);
	} else {
	    marker = localEvents[0].marker;
	    marker.refCount++;
	}
        //create an Event Object
        $("#addEventButt").unbind('click');
	$("#side_collapse").unbind('click');
        $(".datepicker").datetimepicker();
        $(".slider").slider();
	document.getElementById('title').value = '';
	document.getElementById('description').value = '';
	$('#weight').slider('value', 0);
	$('#dateFrom').datetimepicker('setDate', new Date());
	$('#dateUntil').datetimepicker('setDate', new Date());
	$('#side_collapse').bind('click', function() {
		map.removeOverlay(marker); 
		$("#sidebar_btn").click();
	    });
        $("#sidebar_btn").click();
        //add the event to events
        $("#addEventButt").bind('click', function() {
            if ( !validationManager.checkEndTimeAfterStartTime() )
                return;
            var newEvent = {
	        title       :   $('#title').val(),
                description :   $('#description').val(),
                place       :   '',
                weight      :   $('#weight').slider('value'),
                time        :   new Date($('#dateFrom').datetimepicker('getDate')),
                endTime     :   new Date($('#dateUntil').datetimepicker('getDate')),
                duration    :   new Date($('#dateUntil').datetimepicker('getDate')) - new Date($('#dateFrom').datetimepicker('getDate')),
                position    :   [p.lng, p.lat],
                privacy     :   false,
                addTime     :   new Date(),
                finish      :   false,
                alarms      :   []
            };

            $("#sidebar_btn").click();
            Event.saveEvent(newEvent, function(res){
                console.log("newEvent response:" + res);
                newEvent._id = res._id;
		newEvent.marker = marker;
		addInfoWindowToEvent(map, newEvent);
            });
            newEvent.marker = marker;
            events.push(newEvent);
            events = tour(events);
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
	marker.refCount--;
        if (marker === null) return;
	if (marker.refCount == 0) {
	    map.removeOverlay(marker);
	}
        //create an Event Object
        Event.removeEvent(_id, function(res){
            console.log(res);
        });
        events.splice(index, 1);
        events = tour(events);
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
               // console.log(res);
                try{
                    var path = res.getPlan(0).getRoute(0).getPath();
                }catch(err){
                    var path = {}
                }
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
        enableLongPress         :   enableLongPress,
        addRecommendation       :   addRecommendation,
        addEvent                :   addEvent,
        getMap                  :   function(){return map}
    };

}());

$(document).ready(function () {

    ScheduleTour.initMap("map");
    ScheduleTour.geolocate();
    setTimeout(function(){ mygeolocate.watchlocate( ScheduleTour.getMap() ) } , 1000 )
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

    ScheduleTour.enableLongPress();
    setSlidingMap();

    $.getScript("/javascripts/map_search.js")
    //recommend_douban(map);
});
