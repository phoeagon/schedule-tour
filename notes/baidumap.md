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
### get duration of the route
        
        var walking = new BMapWalkingRoute(map);
        var from = getFromPoint();
        var to = getToPoint;
        walking.setSearchCompleteCallback(function(results){
            //0 for firt plan
            //false for integer return 
            results.getPlan(0).getDuration(false);
        });
