Baidu Map API Notes
================================================
Qiu Zhe

## Baidu地圖氣泡內無法使用Jquery-UI的各種widget

## Tips
### get duration/path of the route
        
        var walking = new BMapWalkingRoute(map);
        var from = getFromPoint();
        var to = getToPoint();
        walking.setSearchCompleteCallback(function(results){
            //Duration
            //0 for firt plan
            //false for integer return 
            results.getPlan(0).getDuration(false);
            //Path
            //first route of the first plan
            //returns an array of Points
            results.getPlan(0).getRoute(0).getPath();
        });
        walking.search(from, to);

### search from baidu api
        var local = new BMap.LocalSearch(map, {
                renderOptions:{
                    map: map,
                    autoViewport:true,
                    panel: 'r-result'
                    }
                });
        local.searchNearby("餐饮", searchPoint);

## db operations
### add an event to db
        $.post('/newevententry',
            {
                title: 'test',
                description: 'desc',
                place: 'where',
                weigth: 2,
                time: new Date(),
                endTime: new Date(),
                position: [2.2444, 252.31],
                privacy: false,
                alarms:[]
            },
            function(res) {
                console.log(res);
                alert(res);
            }
        );
### query events of current user
        $.post('/evententries',
            {
            },
            function(res) {
                console.log(res);
                alert(res);
            }
        );
