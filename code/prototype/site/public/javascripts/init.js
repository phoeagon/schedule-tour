function initialize() {
    var map = new BMap.Map("allmap");                        // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);     // 初始化地图,设置中心点坐标和地图级别
    map.addControl(new BMap.NavigationControl());               // 添加平移缩放控件
    map.addControl(new BMap.ScaleControl());                    // 添加比例尺控件
    map.addControl(new BMap.OverviewMapControl());              //添加缩略地图控件
    //map.disableDragging();
    //map.enableScrollWheelZoom();                            //启用滚轮放大缩小
    map.addControl(new BMap.MapTypeControl());          //添加地图类型控件
    map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
    var mapdiv = document.getElementById('allmap');
    var calend = document.getElementById('calendar');
    mapdiv.style.top = '0px';
    mapdiv.style.left = '0px';
    $("#allmap").css({'box-shadow':'15px 15px 15px 15px #000000;', 
		      '-webkit-box-shadow':'15px 15px 15px 15px #000000'});

    var calHeight = '500px';
    var calAnimationTime = '1000ms';
    var sideWid = '200px';
    var sideAnimationTime = '500ms';
    
    function showCal() {
	$("#allmap").css({'transition':'top '+calAnimationTime, '-webkit-transition':'top'+calAnimationTime});
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
	$("#allmap").css({'transition':'top '+calAnimationTime, '-webkit-transition':'top'+calAnimationTime});
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
	$("#allmap").css({'transition':'left '+sideAnimationTime, '-webkit-transition':'left '+sideAnimationTime});
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
	$("#allmap").css({'transition':'left '+sideAnimationTime, '-webkit-transition':'left '+sideAnimationTime});
	mapdiv.style.left = '0px'; 
	var btn = $("#sidebar_btn");
	btn.css({'left':'0px'});
	btn.text('>');
	$("#sidebar").addClass('hidden');
	btn.unbind('click');
	btn.bind('click', showSide);
	$("#classic_btn").bind('click', showCal);
    }
    
    $("#calendar").removeClass('hidden');
    $("#classic_btn").bind('click', showCal);
    $("#sidebar_btn").bind('click', showSide);
}

onload = initialize;