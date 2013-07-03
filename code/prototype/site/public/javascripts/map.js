$(document).ready(function () {
    var map = new BMap.Map("map");
    var point = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point,15);

    //enable zoom by mouse wheel
    map.enableScrollWheelZoom();

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

});
