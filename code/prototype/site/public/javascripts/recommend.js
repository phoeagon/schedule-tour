
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
                var point = new ScheduleTour.Point(point[1], point[0]);
                if (point.lng === point.lat && point.lng === 0) return;
                var marker = new ScheduleTour.Marker(point);

                var opts = {
                    title : '<b>'+e.title+'</b>'
                };
                var sContent = "<img style='float:right;margin:4px' id='imgDemo' src='" + e.image + "' width='139' height='104'/>" + 
                    "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>" + e.content.substring(0,300) + "...</p>" + 
                    "<p>See more <a href='" + e.alt + "' target='_blank'>here</a> on Douban</p>" +
                    "</div>";
                var infoWindow = new ScheduleTour.InfoWindow(sContent, opts);  // 创建信息窗口对象
                marker.setMap(map);
                //DEPRECATED:map.addOverlay(marker);
                //DEPRECATED: marker.addEventListener("click", function(){
                marker.addListener("click", function(){       
                    this.openInfoWindow(infoWindow);
                    //图片加载完毕重绘infowindow
                    document.getElementById('imgDemo').onload = function (){
                        infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
                    }
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
                var point = new ScheduleTour.Point(point[1], point[0]);
                if (point.lng === point.lat && point.lng === 0) return;
                var marker = new ScheduleTour.Marker(point);

                var opts = {
                    title : '<b>'+e.title+'</b>'
                };
                var sContent = "<img style='float:right;margin:4px' id='imgDemo' src='" + e.image + "' width='139' height='104'/>" + 
                    "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>" + e.content.substring(0,300) + "...</p>" + 
                    "<p>See more <a href='" + e.alt + "' target='_blank'>here</a> on Douban</p>" +
                    "</div>";
                var infoWindow = new ScheduleTour.InfoWindow(sContent, opts);  // 创建信息窗口对象
                marker.setMap(map);
                //DEPRECATED map.addOverlay(marker);
                //DEPRECATED: marker.addEventListener("click", function(){
                marker.addListener("click", function(){
                    this.openInfoWindow(infoWindow);
                    //图片加载完毕重绘infowindow
                    document.getElementById('imgDemo').onload = function (){
                        infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
                    }
                });
            });
        }
    );

}
