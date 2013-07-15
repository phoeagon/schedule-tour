
var recommend_douban = function() {
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
                var point = new BMap.Point(point[1], point[0]);
                if (point.lng === point.lat && point.lng === 0) return;
                var marker = new BMap.Marker(point);

                var opts = {
                    title : e.title
                };
                var sContent = "<img style='float:right;margin:4px' id='imgDemo' src='" + e.image + "' width='139' height='104'/>" + 
                    "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>" + e.content + "</p>" + 
                    "<p>See more here: " + e.alt + "</p>" +
                    "</div>";
                var infoWindow = new BMap.InfoWindow(sContent, opts);  // 创建信息窗口对象
                map.addOverlay(marker);
                marker.addEventListener("click", function(){          
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
