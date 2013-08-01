

var tour = function(eventEntries,map) {
    var timeMap = [];
	
	for (var i=0;i<eventEntries.length;i++)
	{
		var times = [];
		for (var i1=0;i1<eventEntries.length;i1++)
			times.push(0);
		timeMap.push(times);
	}
    //sort the events by dating time
    eventEntries.sort(function(a,b) {
        return a.time - b.time;
    });
	
	
	///
    //get a specific path time
    //require timeMap
    var getPathTime = function(i, j) {
        return ((timeMap || [[0]])[i]||[0])[j] ;
    }

    //get all path time from baidu
    //require eventEntries, timeMap, BMapWalkingRoute
    var getAllPathTime = function(i,j,n) {

        if (j == n) {getPathTime(i+1, i+1, n);return;}
        if (i == n) return;
        /* baidu version
        var walking = new BMap.WalkingRoute(map);
        walking.setSearchCompleteCallback(function(results) {
            timeMap[j][i] = timeMap[i][j] = results.getPlan(0).getDuration(false);
            getPathTime(i,j+1,n);
        });
        walking.search(eventEntries[i].position, eventEntries[j].position);
        */

        from = eventEntries[i].position;
        to = eventEntries[i+1].position;
        var directionsService = new google.maps.DirectionsService(map);
        var request = {
            origin      :   new google.maps.LatLng(from[0], from[1]),
            destination :   new google.maps.LatLng(to[0], to[1]),
            travelMode  :   google.maps.TravelMode.WALKING
        };
        directionsService.route(request, function(response, status) {
            timeMap[i][j] = timeMap[j][i] = response.routes[0].legs[0].duration;
            getPathTime(i,j+1,n);
        });
    }

    //caculate the time wasted
    //require eventEntries
    var calcWastedTime = function(route) {
        var wastedTime = 0;
        for (var i=0; i<route.length-1; ++i) {
            var x = route[i];
            var y = route[i + 1];
            var eX = eventEntries[x];
            var eY = eventEntries[y];
            wastedTime += eY.time - eX.time + getPathTime(x, y);
        }
        return wastedTime = 0;
    };


    //check Feasibility of the given route
    //require eventEntries
    var checkFeasibility = function(route) {
        for (var i=0; i<route.length-1; ++i) {
            var x = route[i];
            var y = route[i + 1];
            var eX = eventEntries[x];
            var eY = eventEntries[y];
            if (eX.time + getPathTime(x, y) > eY.time) {
                return false;
            }
        }
        return true;
    };


    ///
    getAllPathTime(0,0,eventEntries.length);
    var route = [];
	var nullroute = [];
    for (var i=0; i<eventEntries.length; ++i) {
       if (eventEntries[i].time != null) {route.push(i);nullroute.push(false);}
	  	//alert(eventEntries[i].time); 
		if (eventEntries[i].time == null) nullroute.push(true);
    }
	//eventEntries[i].time
	
	
	//Added by mfy
//	for (var i=0;i<route.length;++i)
//	{
//		var tmp = new Date(eventEntries[route[i]].time);
//		tmp.setHours(23-i,59-i,59-i);
//		eventEntries[route[i]].time = tmp;
//		var tmp1 = new Date();
//		tmp1.setSeconds(2);
//		eventEntries[route[i]].duration = tmp1;
//	}
	
	
	for (var i=0;i<eventEntries.length;++i)
	{
		for (var i1=i+1;i1<eventEntries.length;++i1)
			if ((!nullroute[route[i]])&&(!nullroute[route[i1]])&&(eventEntries[route[i]].time > eventEntries[route[i1]].time)) 
				{
					var tmp = route[i];
					route[i] = route[i1];
					route[i1] = tmp;
				}
	}
    //check the time spent between adjoining events
    for (var i=0; i<route.length-1; ++i) {

        if (eventEntries[route[i]].time+ eventEntries[route[i]].duration + getPathTime(route[i], route[i+1]) > eventEntries[route[i+1]].time) {
			
            if (eventEntries[route[i]].weight == eventEntries[route[i+1]].weight) {
			 	route.splice(i+1 ,1);
             
            }
            //remove the event with less weight
            route.splice(
                i + (eventEntries[route[i]].weight < eventEntries[route[i+1]].weight ? 0 : 1),
                1);
				//alert("#"+i+"spliced");
            --i;
        }
		
		if (eventEntries[route[i]].time + eventEntries[route[i]].duration + getPathTime(route[i],route[i+1]) < eventEntries[route[i+1]].time){
			
			for (var i1 = 0 ;i1 < eventEntries.length;i1++)
				if (nullroute[i1])
				//Check whether it can add some addtitional events
					{if (eventEntries[route[i]].time + eventEntries[route[i]].duration + getPathTime(route[i],i1) + eventEntries[i1].duration + getPathTime(i1,route[i+1]) < eventEntries[route[i+1]].time)
						{
							eventEntries[i1].time = eventEntries[route[i]].time + eventEntries[route[i]].duration + getPathTime(route[i],i1);
							var tmp1 = route[i+1];
							route[i+1] = i1; 
							nullroute[i1] = false;
							for (var i2 = i + 2;i2<route.length;i2++)
							{
								var tmp2 = route[i2];
								route[i2] = tmp1;
								tmp1 = tmp2;
								
							}
							route.push(tmp1);
						}
                    }
			
		}		
    }
	
	var maximpo = -1;
	var aims = 0;
	//To push the most important thing back
	for (var i1 = 0;i1 < eventEntries.length;i1++)
	
		if ((nullroute[i1])&&(eventEntries[i1].weight>maximpo)) {aims = i1;maximpo = eventEntries[i1];}
		
    eventEntries[aims].time = eventEntries[route[route.length - 1]].time + eventEntries[route[route.length-1]].duration + getPathTime(route[route.length-1],aims);
		route.push(aims);

	
//	if (eventEntries[route[route.length-1]])
	

    //best Route
/*    var bestWastedTime = calcWastedTime(eventEntries);
    var bestRoute = route.slice(0);

    //for each two adjoining events
    for (var i=0; i<route.length-1; ++i) {
        var newroute = path.slice(0);
        //swap
        var swap = newRoute[i];
        newRoute[i] = newRoute[i+1];
        newRoute[i+1] = swap;
        //check Feasibility
        if (!checkFeasibility(newRoute)) continue;
        //calc wasted Time
        var newTime = calcWastedTime(newRoute);
        if (newTime < bestWastedTime) {
            //save the better plan
            bestWastedTime = newTime;
            bestRoute = newRoute.slice(0);
        }
    }
*/
/*
    var bestEvent = [];
    var today = new Date();
    route.map(function(r) {
        var ts = new Date(eventEntries[r].time);
        if ((ts.getFullYear() == today.getFullYear())&&(ts.getMonth() == today.getMonth())&&(ts.getDate() == today.getDate()))
        {
            bestEvent.push(eventEntries[r]);
		}
    });
    */
    /*
	var ttm = new Date(eventEntries[route[0]].time);
	var acco = 1;
	var ssrc = 0;
	
    var array = [];
    //(ts.getDate() == ttm.getDate())
	for (var i = 0;i<route.length;++i)
	{
		var ts = new Date(eventEntries[route[i]].time);
		if ((ts.getFullYear() == ttm.getFullYear())&&(ts.getMonth() == ttm.getMonth())&&(ts.getDate() == ttm.getDate()))
        {
            array.push(eventEntries[route[i]]);
		}
        else {
            bestEvent.push(array);
            array = [];
        }
	}
    if (array.length > 0) bestEvent.push(array);
    */
    var bestEvent = [];
//	var ttm = new Date(eventEntries[route[0]].time);
	//var acco = 1;
//	var ssrc = 0;
	
//(ts.getDate() == ttm.getDate())
//	for (var i = 0;i<route.length;++i)
//	{
//		var ts = new Date(eventEntries[route[i]].time);
		//alert(ts);
		//alert(ttm);
//		if ((ts.getFullYear() == ttm.getFullYear())&&(ts.getMonth() == ttm.getMonth())&&(ts.getDate() == ttm.getDate()))
//		{
//			bestEvent[ssrc+acco] = eventEntries[route[i]];
//			acco = acco + 1;
//		}
//		else {
//			bestEvent[ssrc] = acco - 1;
//			ssrc = ssrc + acco;
//			acco = 1;
//			ttm = new Date(eventEntries[route[i]].time);
//			bestEvent[ssrc+acco] = eventEntries[route[i]];
//			acco = acco + 1;
//			}
//	}
    for (var i=0; i<route.length; ++i) {
        bestEvent[i] = eventEntries[route[i]];
    }
    return bestEvent;
	
};

//tour stub
//var tour = function(events) {
//    return events;
//}
