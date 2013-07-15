Tips on `BaiduMapAPI`
=====================================================
MinGKai, 2013 July 12

## Tips
### get points in a route returned by BMapWalkingRoute.search
        var walking = new BMapWalkingRoute(map);
        var from = getFromPoint();
        var to = getToPoint;
        walking.setPolylinesSetCallback(function(routes){
            for (var i=0; i<routes.length; ++i) {
                console.log(routes[i]);
                //here it is
            }
        });
        walking.search(from, to);

### get duration of the route
        
        var walking = new BMapWalkingRoute(map);
        var from = getFromPoint();
        var to = getToPoint;
        walking.setSearchCompleteCallback(function(results){
            //0 for firt plan
            //false for integer return 
            results.getPlan(0).getDuration(false);
        });
        walking.search(from, to);

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
