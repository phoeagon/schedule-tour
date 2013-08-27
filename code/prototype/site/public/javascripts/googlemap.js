var ScheduleTourMap = {
        Point                   :   google.maps.LatLng ,
        Marker                  :   google.maps.Marker ,
        InfoWindow              :   google.maps.InfoWindow ,
        panTo                   :   function( t ){
                                        return ScheduleTour.getMap().panTo(t);
    }
}
var Event = (function() {
    var createEvent = function(p) {
        var e = {};
        e.user = null;
        e.title = '';
        e.place = '';
        e.position = [p.lat(), p.lng()];
        e.time = 0
        e.endTime = 0
        //e.time = $("#dateFrom").datetimepicker("getDate");
        //e.endTime = $("#dateUntil").datetimepicker("getDate");
        e.description = document.getElementById('description').value;
        e.alarams = null;
        e.privacy = null;
        e.weight = $("#weight").sliders("value");
        e.finish = null;
        e.addTime = new Date();

        //$(".datepicker").datetimepicker();
        $(".slider").slider({ step: 1 , min : 0 , max : 10 });
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

    $("#timeline_btn").bind('click', function() {
	    $("#timeline").toggleClass('shown');});

    function showCal() {
        $("#map").css({'transition':'top '+layoutMetrics.calAnimationTime, '-webkit-transition':'top'+layoutMetrics.calAnimationTime});
        $('#map').css({'top' : layoutMetrics.calHeight});
        var btn = $("#calendar_btn");
        btn.addClass('extended');
        //btn.text('Calendar△');
        $("#calendar").removeClass('hidden');
        btn.unbind('click');
        btn.bind('click', hideCal);
        $("#sidebar_btn").unbind('click');
        $('.fc-button-agendaDay').click();
        $('.fc-button-today').click();
	setTimeout(function() {
		$('#calendar').css({'z-index':'1'});}, parseInt(layoutMetrics.calAnimationTime));
        $("#search_panel").addClass('hidden');
    }
    function hideCal() {
	$('#calendar').css({'z-index':'-5'});
        $("#map").css({'transition':'top '+layoutMetrics.calAnimationTime, '-webkit-transition':'top'+layoutMetrics.calAnimationTime});
	$('#map').css({'top':'0'});
	$('#map_pad').removeClass('inUse');
        var btn = $("#calendar_btn");
        btn.removeClass('extended');
        $('#map').removeClass('top_collapse');
        //btn.text('Calendar▽');
        btn.unbind('click');
        btn.bind('click', showCal);
        $("#sidebar_btn").bind('click', showSide);
        setTimeout(function() {
		$("#calendar").addClass('hidden');}, parseInt(layoutMetrics.calAnimationTime));
        $("#search_panel").removeClass('hidden');
    }

    function showSide() {
        $("#map").css({'transition':'left '+layoutMetrics.sideAnimationTime, '-webkit-transition':'left '+layoutMetrics.sideAnimationTime});        
	$("#map").css({'left' : layoutMetrics.sideWid});
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
        $("#map").css({'transition':'left '+layoutMetrics.sideAnimationTime, '-webkit-transition':'left '+layoutMetrics.sideAnimationTime});
	$("#map").css({'left' : '0'});
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


var ScheduleTour = (function() {
    globalEventCache = {};
    //map of baidu
    var map = null;
    //events to save all events
    var events = [];
    //polylines to save all path
    var polylines = [];
    var routeArray = [];
    var directionsService = null;
    var stepDisplay = null;
    var geocoder = null;

    var geolocate = mygeolocate.watchlocate
    var panTo = function() {
        mygeolocate.panTo(map)
        map.setZoom(15);
    };

    $(window).load(function(){ $('#geoloc_btn').click( panTo ); });
    
    var initMap = function(mapDOM) {
        google.maps.visualRefresh = true;
        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(-34.397, 150.644),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: true,
            zoomControl: true,
            scaleControl: true
        };
        map = new google.maps.Map(
            mapDOM,
            mapOptions
        );
        // AUTO pan To current position
        panTo();
        //addContentMenu(addEvent);
        directionsService = new google.maps.DirectionsService();
        geocoder = new google.maps.Geocoder();
    };

    var addInfoWindowToEvent = function(map, e) {
        var eid = e._id;
        var pos = e.position;
        var locals = findEventByPos(pos);
        locals.push(e);
        var infoContent = "<h4>"+e.title+"</h4>"+
            "<h5>"+"Start Time:"+moment(e.time).calendar()+"</h5>"+
            "<h5>"+"End Time:"+moment(e.endTime).calendar()+"</h5>"+
            "<p>"+e.description+"</p>"+
            "<button onclick='javascript:ScheduleTour.removeEvent(\"" + e._id + "\");' class='btn btn-default'>Delete</button><br/>";
        for (var i = 0; i < locals.length; i++) {
            if (locals[i]._id != eid) {
                var ee = locals[i];
                infoContent = infoContent +
                    "<h4>"+ee.title+"</h4>"+
                    "<h5>"+"Start Time:"+moment(ee.time).calendar()+"</h5>"+
                    "<h5>"+"End Time:"+moment(ee.endTime).calendar()+"</h5>"+
                    "<p>"+ee.description+"</p>"+
                    "<button class='btn btn-default' onclick='javascript:ScheduleTour.removeEvent(\"" + ee._id + "\");'>Delete</button><br/>";
            }
        }
        infoContent = infoContent + "<span class='favbtn ' lng='"+pos[0]+"' lat='"+pos[1]+
            "' position='"+escape(e.place)+"'></span>"
        infoContent = infoContent + "<button class='add-event-btn btn' onclick='javascript:ScheduleTour.addEvent(new google.maps.LatLng("+pos[0]+", "+pos[1]+"));'>New Event</button>";

        var infoWindow = new ScheduleTourMap.InfoWindow({
            content :   infoContent
        });
        google.maps.event.clearListeners(e.marker, 'click');
        google.maps.event.addListener(e.marker, 'click', function() {
            infoWindow.open(map, e.marker);
            placeManager.configureButton( map )
        });
    }
    var newMarkerToEvent = function(map, e) {
        var p = new google.maps.LatLng(e.position[0], e.position[1]);
        var localEvents = findEventByPos(e.position);
        var marker = null;
        if (localEvents.length == 0) {
            marker = new ScheduleTourMap.Marker({
                position    :   p,
                map         :   map
            });
            marker.refCount = 1;
            //var px = map.pointToPixel(p);
        } else {
            marker = localEvents[0].marker;
            marker.refCount++;
        }
        marker.setZIndex(2);
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
        //for(var i = 0; i < eventsBuff.length; i++) {
        var render_event = function(i){
            if ( i == eventsBuff.length ){
                afterPushedTours();
                return;
            }
            var newEvent = newMarkerToEvent(map, eventsBuff[i]);
            addInfoWindowToEvent(map, newEvent);
            newEvent.time = new Date(newEvent.time);
            newEvent.endTime = new Date(newEvent.endTime);
            newEvent.duration = new Date(newEvent.duration);
            events.push(newEvent);
            
            setTimeout( function(){
                render_event( i + 1 );
            } , 10 );
        }
        if ( eventsBuff.length ){
            render_event( 0 );
        }
        //}
        var afterPushedTours = function(){
            events = tour(events);
            drawRoute(map, events, polylines);
        }
        //TODO: enable the button of adding event
        });
    }

    
    var longPresser = null;
    var enableLongPress = function() {
        google.maps.event.addDomListener(map, 'mousedown', function(e) {
            longPresser = setTimeout(function() {
                addEvent(e.latLng);
            }, 1500);
        });
        var clearSpecTimeout = function(e) {
            if (longPresser) {
                clearTimeout(longPresser);
                longPresser = null;
            }
        };
        google.maps.event.addDomListener(map, 'mouseup', clearSpecTimeout );
        google.maps.event.addDomListener(map, 'mousemove', clearSpecTimeout );
        //map.addListener('longpress', function(e) { addEvent(e.point); });
    }
    var enableRightClick = function() {
        google.maps.event.addDomListener(map, 'rightclick', function(e) {
            if (longPresser) {
                clearTimeout(longPresser);
                longPresser = null;
            }
            //addEvent(e.latLng);
            Sidebar.showSidebar('addEvent', e.latLng);
            e.stop();
        });
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

    var geocode = function(latlng, callback) {
        if (!geocoder) geocoder = new google.maps.Geocoder();
        geocoder.geocode(
            {
                latLng: latLng
            },
            function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    callback(results[1].formatted_address, 'OK');
                } else {
                    callback('', 'Not Found');
                }
            } else {
                callback('', 'Geocoder failed due to: ' + status);
            }
        });
    };

    //add event listener
    var addEvent = function (latLng) {
        //add marker to map
        var localEvents = findEventByPos([latLng.lat(), latLng.lng()]);
        var marker = null;
        if (localEvents.length == 0) {
            marker = new ScheduleTourMap.Marker({
                position    :   latLng,
                map         :   map
            });
            marker.refCount = 1;
            //var px = map.pointToPixel(p);
        } else {
            marker = localEvents[0].marker;
            marker.refCount++;
        }
        //create an Event Object
        $("#addEventButt").unbind('click');
        $("#side_collapse").unbind('click');
        $(".datepicker").datetimepicker();
        $(".slider").slider({ step: 1 , min : 0 , max : 10 });

        geocoder.geocode(
            {
                latLng: latLng
            },
            function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    $('#newPlace').val(results[1].formatted_address);
                } else {
                    $('#newPlace').val('');
                }
            } else {
                $('#newPlace').val('');
                console.log('Geocoder failed due to: ' + status);
            }
        });


        $('#title').val('');
        $('#description').val('');
        $('#newLat').val(latLng.lat());
        $('#newLng').val(latLng.lng());
        $('#weight').slider('value', 0);
        $('#dateFrom').datetimepicker('setDate', new Date());
        $('#dateUntil').datetimepicker('setDate', new Date());
        $('#side_collapse').bind('click', function() {
            marker.setMap(null); 
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
                place       :   $('#newPlace').val(),
                weight      :   $('#weight').slider('value'),
                time        :   new Date($('#dateFrom').datetimepicker('getDate')),
                endTime     :   new Date($('#dateUntil').datetimepicker('getDate')),
                duration    :   new Date($('#dateUntil').datetimepicker('getDate')) - new Date($('#dateFrom').datetimepicker('getDate')),
                position    :   [latLng.lat(), latLng.lng()],
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
                events.push(newEvent);
                events = tour(events);
                drawRoute();
                if (calendarRenderer)
                    calendarRenderer.refresh();
                if (Timeline)
                    Timeline.update()
            });
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
            marker.setMap(null);
        }
        //create an Event Object
        Event.removeEvent(_id, function(res){
            console.log(res);
        });
        events.splice(index, 1);
        events = tour(events);
        drawRoute();
        if (calendarRenderer)
            calendarRenderer.refresh()
        if (Timeline)
            Timeline.update()
    }

    var clearRouteFromMap = function (route) {
        if (route.markerArray) {
            route.markerArray.map(function(marker) {
                marker.setMap(null);
            });
        }
        if (route.infoWindowArray) {
            route.infoWindowArray.map(function(infoWindow) {
                infoWindow.setMap(null);
            });
        }
        if (route.directionsDisply) {
            route.directionsDisplay.setMap(null);
        }
        if (route.polyline) {
            route.polyline.setMap(null);
        }
    }

    var drawRoute = function() {
        //remove old paths
        routeArray.map(function(route) {
            clearRouteFromMap(route);
        });
        routeArray = [];

        //generate new paths
        for (var i=0; i<events.length-1; ++i) {
            var from = new google.maps.LatLng(events[i].position[0], events[i].position[1]);
            var to = new google.maps.LatLng(events[i+1].position[0], events[i+1].position[1]);
            var request = {
                origin      :   from,
                destination :   to,
                travelMode  :   google.maps.TravelMode.WALKING
            };
            routeArray[i] = {};
            requestDirections(request, routeArray[i], 'rgb(255,'+Math.min(i*50,255)+',255)');
        }
    }

    var requestDirections = function(request, route, color) {
        directionsService.route(request, function(response, status) {
            //remove old path
            if (route) {
                clearRouteFromMap(route);
            }
            var markerArray = [];
            var infoWindowArray = [];

            if (!(response && response.routes && response.routes[0]
            && response.routes[0].legs && response.routes[0].legs[0])) return;

            var myRoute = response.routes[0].legs[0];

            var icon = {
                url: '/images/circle.png',
                anchor: new ScheduleTourMap.Point(10, 10)
            };
            //draw polyline
            var path = [];
            myRoute.steps.map(function(step) {
                path = path.concat(step.path);
            });
            var polyline = new google.maps.Polyline({
                clickable   :   true,
                map         :   map,
                path        :   path,
                strokeOpacity   :   0.9,
                strokeColor     :   color,
                strokeWeight    :   (1)*10
            });
            //bind polyline click event
            google.maps.event.addDomListener(polyline, 'click', switchTravelMode);

            for (var j=0; j<myRoute.steps.length; ++j) {
                var marker = new google.maps.Marker({
                    position: myRoute.steps[j].start_point,
                    icon: icon,
                    map: map
                });
                marker.setZIndex(1);
                var infoWindow = new ScheduleTourMap.InfoWindow({
                    content :   myRoute.steps[j].instructions
                });
                addInfoWindowToMarker(infoWindow, marker);
                markerArray[j] = marker;
                infoWindowArray[j] = infoWindow;
            }
            route = {
                markerArray         :   markerArray,
                infoWindowArray     :   infoWindowArray,
                directionsDisplay   :   null,
                polyline            :   polyline
            };

            function switchTravelMode(e) {
                var travelModes = [
                    //google.maps.TravelMode.BICYCLING,
                    google.maps.TravelMode.DRIVING,
                    google.maps.TravelMode.TRANSIT,
                    google.maps.TravelMode.WALKING
                ];
                console.log('polyline clicked');
                var newRequest = request;
                var travelIndex = travelModes.indexOf(request.travelMode);
                travelIndex = (travelIndex + 1) % travelModes.length;
                console.log(travelIndex);
                newRequest.travelMode = travelModes[travelIndex];
                console.log(newRequest);
                requestDirections(newRequest, route, color);

                humane.clickToClose = true;
                humane.timeout = 1000;
                var mouseEvent = null;
                for (ele in e) {
                    if (e[ele] instanceof MouseEvent) {
                        mouseEvent = e[ele];
                        break;
                    }
                }
                if (mouseEvent) {
                    humane.left = mouseEvent.clientX - 50 + 'px';
                    humane.top = mouseEvent.clientY - 50 + 'px';
                    humane.log(travelModes[travelIndex]);
                }

            }

        });
        function addInfoWindowToMarker(infoWindow, marker) {
            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open(map, marker);
            });
        };
    };
    var weatherLayer = null;
    var enableWeatherLayer = function() {
        if (weatherLayer) {
            weatherLayer.setMap(map);
            return;
        }
        weatherLayer = new google.maps.weather.WeatherLayer({
            temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
        });
        weatherLayer.setMap(map);
    };
    var disableWeatherLayer = function() {
        if (weatherLayer) weatherLayer.setMap(map);
    };
    var cloudLayer = null;
    var enableCloudLayer = function() {
        if (cloudLayer) {
            cloudLayer.setMap(map);
            return;
        }
        var cloudLayer = new google.maps.weather.CloudLayer();
        cloudLayer.setMap(map);
    };
    var disableCloudLayer = function() {
        if (cloudLayer)
            cloudLayer.setMap(null);
    };

    var firstRoute = null;
    var currentPosition = null;
    var watchlocateCallback = function( latLng ) {
        currentPosition = latLng;
        if ( firstRoute ) {
            clearRouteFromMap(firstRoute);
        }

        if ( !( events && events[0] ) ) return;

        var to = new google.maps.LatLng(events[0].position[0], events[0].position[1]);
        var request = {
            origin      :   latLng,
            destination :   to,
            travelMode  :   google.maps.TravelMode.WALKING
        };
        firstRoute = {};
        requestDirections(request, firstRoute, 'rgb(0,0,255)');
    };

    var pickPlace = function(callbackState, callback) {

        google.maps.event.addDomListenerOnce(map, 'click', function(e) {
            geocode(e.latLng, function(result, status) {
                callback(callbackState, result, e.latLng);
            });
        });
    };

    return {
        initMap                 :   initMap,
        geolocate               :   geolocate,
        fetchEventsFromServer   :   fetchEventsFromServer,
        drawRoute               :   drawRoute,
        removeEvent             :   removeEvent,
        enableLongPress         :   enableLongPress,
        enableRightClick        :   enableRightClick,
        addRecommendation       :   addRecommendation,
        addEvent                :   addEvent,
        getMap                  :   function(){return map;},
        enableWeatherLayer      :   enableWeatherLayer,
        disableWeatherLayer     :   disableWeatherLayer,
        enableCloudLayer        :   enableCloudLayer,
        disableCloudLayer       :   disableCloudLayer,
        watchlocateCallback     :   watchlocateCallback,
        getCurrentPosition      :   function(){return currentPosition;},
        panTo                   :   function( t ){
                                        return ScheduleTour.getMap().panTo(t);
                                    },
        pickPlace               :   pickPlace
    };

}());

$(window).load(function () {

    ScheduleTour.initMap($('#map').get(0));
    $('#calendar_btn').click(function() { CalendarBar.toggleCalendarBar(); });

    ScheduleTour.geolocate(ScheduleTour.getMap(), ScheduleTour.watchlocateCallback);
    setTimeout(function(){
        mygeolocate.watchlocate(
            ScheduleTour.getMap(),
            ScheduleTour.watchlocateCallback
            )
        } , 1000 )
    ScheduleTour.fetchEventsFromServer();
    
    ScheduleTour.enableLongPress();
    ScheduleTour.enableRightClick();
    //setSlidingMap();
    ScheduleTour.enableWeatherLayer();
    ScheduleTour.enableCloudLayer();

//    $.getScript("/javascripts/map_search.js")
    recommend_douban( ScheduleTour.getMap() );

    $('#fav_list_button').click( placeManager.toggleResultPad );
    placeManager.getPlace();
});
