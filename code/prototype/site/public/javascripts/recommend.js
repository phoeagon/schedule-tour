
var recommend_douban = function(map) {
    // get location code from douban
    var loc = 108296;
    $.ajax({
        url:    'https://api.douban.com/v2/event/list',     //url
        data:{
            loc:    loc,                             //loc code
            start:  0,
            count:  100
        },
        success: function(res) {
            var count = res.count;
            var total = res.total;
            var events = res.events;
            events.map(function(e) {
                var point = e.geo.split(' ');
                var point = new ScheduleTourMap.Point(point[0], point[1]);
                if (point.lng() === point.lat() && point.lng() === 0) return;
                var marker = new ScheduleTourMap.Marker({
                    map         :   map,
                    position    :   point,
                    title   :   e.title ,
                    icon    : {
                        path : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW ,
                        strokeOpacity : 0.8,
                        strokeColor   : 'green',
                        strokeWeight  : 14
                    }
                });

                var opts = {
                    title : '<b>'+e.title+'</b>'
                };
                var sContent = "<img style='float:right;margin:4px' id='imgDemo' src='" + e.image + "' width='139' height='104'/>" + 
                    "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>" + e.content.substring(0,300) + "...</p>" + 
                    "<p>See more <a href='" + e.alt + "' target='_blank'>here</a> on Douban</p>" +
                    "</div>";
                var infoWindow = new ScheduleTourMap.InfoWindow({
                    content:    sContent
                });
                //console.log( infoWindow )
                //marker.setMap(map);
                //DEPRECATED:map.addOverlay(marker);
                //DEPRECATED: marker.addEventListener("click", function(){
                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.open(map, marker);
                //    placeManager.configureButton( map )
                });
            });
        },
        dataType: 'jsonp'
    });

}

recommend_douban_db = function(map, lng, lat, dist, num) {
    // get location code from douban
    $.post('/event/recommend',
        {
            lng :   lng,
            lat :   lat,
            dist:   dist,
            num :   num
        },
        function(res) {
            res = JSON.parse(res);
            var count = res.count;
            var total = res.total;
            var events = res.events;
            events.map(function(e) {
                var point = e.geo.split(' ');
                var point = new ScheduleTourMap.Point(point[0], point[1]);
                if (point.lng() === point.lat() && point.lng() === 0) return;
                var marker = new ScheduleTourMap.Marker({
                    map         :   map,
                    position    :   point,
                    title   :   e.title,
                    icon    :{
                        path : google.maps.SymbolPath.BACKWARD_CLOSED_ARROW ,
                        strokeOpacity : 0.8,
                        strokeColor   : 'pink',
                        strokeWeight  : 14
                    }
                });

                var opts = {
                    title : '<b>'+e.title+'</b>'
                };
                var sContent = "<img style='float:right;margin:4px' id='imgDemo' src='" + e.image + "' width='139' height='104'/>" + 
                    "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>" + e.content.substring(0,300) + "...</p>" + 
                    "<p>See more <a href='" + e.alt + "' target='_blank'>here</a> on Douban</p>" +
                    "</div>";
                var infoWindow = new ScheduleTourMap.InfoWindow({
                    content:sContent
                    });  // 创建信息窗口对象
                //marker.setMap(map);
                //DEPRECATED map.addOverlay(marker);
                //DEPRECATED: marker.addEventListener("click", function(){
                google.maps.event.addListener(marker, 'click', function() {
                    infoWindow.open(map, marker);
                //    placeManager.configureButton( map )
                });
            });
        }
    );

}
