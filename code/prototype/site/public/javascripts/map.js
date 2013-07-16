
var Event =  {
createEvent :   function(p) {
        var e = {};
        e.user = null;
        e.title = null;
        e.place = '';
        e.position = p;
        e.time = $("#dateFrom").datepicker("getDate");
        e.endTime = $("#dateUntil").datepicker("getDate");
        e.description = document.getElementById('description').value;
        e.alarams = null;
        e.privacy = null;
        e.weight = $("#weight").slider("value");
        e.finish = null;
        e.addTime = new Date();

        $(".datepicker").datepicker();
        $(".slider").slider();
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

var drawRoute = function(map, walkings, events) {
    //clear previous paths
    //walkings = [];
    walkings.splice(0);
    //generate new paths
    for (i=0; i<events.length-1; ++i) {
        var walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, panel: "r-result", autoViewport: false}});
        var from = new BMap.Point(events[i].position[0], events[i].position[1]);
        var to = new BMap.Point(events[i+1].position[0], events[i+1].position[1]);
        walking.search(from, to);
        walkings.push(walking);
    }
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
        $("#addEventButt").unbind('click');
        $(".datepicker").datepicker();
        $(".slider").slider();
        $("#sidebar_btn").click();
        //add the event to events
        $("#addEventButt").bind('click', function() {
            var e = Event.createEvent(p);
            events.push(e);
            //sort by addTime
            //THIS NEEDS TO BE IMPLEMENTED BY ANOTHER WAY
            events.sort(function (x, y) {
                return x.addTime - y.addTime;
            });
            $("#sidebar_btn").click();
            $.post('/newevententry',
                {       
                    title       : 'test',
                    description : e.description,
                    place       : e.position,
                    weight      : e.weight,
                    time        : e.time,
                    endTime     : e.endTime,
                    position    : [e.position.lng, e.position.lat],
                    privacy     : false,
                    addTime     : e.addTime,
                    alarms      :[]
                },
                function(res) {
                    console.log(res);
                    alert(res);
                }
                );
            tour(events);
            drawRoute(map, walkings, events);
        });
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

    $.post('/evententries', {}, function(res) {
        var obj = JSON.parse(res);
        var eventsBuff = obj.eventEntries;
        for(var i = 0; i < eventsBuff.length; i++) {
            var marker = new BMap.Marker(new BMap.Point(eventsBuff[i].position[0], eventsBuff[i].position[1]));
            map.addOverlay(marker);
            events.push(eventsBuff[i]);
	    }
        tour(events);
        drawRoute(map, walkings, events);
	});

    map.addEventListener('longpress', function(e) { addEvent(e.point); });

    setSlidingMap();

    recommend_douban(map);
});
