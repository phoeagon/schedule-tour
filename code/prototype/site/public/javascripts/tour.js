//get a specific path time
//require timeMap
var getPathTime = function(i, j) {
    while (timeMap[i][j] === -1);
    return timeMap[i][j];
}

//get all path time from baidu
//require eventEntries, timeMap, BMapWalkingRoute
var getAllPathTime = function() {
    var len = eventEntries.length;
    for (var i=0; i<len; ++i) {
        for (var j=0; j<len; ++j) {
            timeMap[i][j] = i===j ? 0 : -1;
        }
    }
    for (var i=0; i<len; ++i) {
        for (var j=i+1; j<len; ++j) {
            var walking = new BMapWalkingRoute(map);
            walking.setSearchCompleteCallback(function(results) {
                timeMap[j][i] = timeMap[i][j] = results.getPlan(0).getDuration(false);
            });
            walking.search(eventEntries[i].position, eventEntries[j].position);
        }
    }
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
}

var tour = function(eventEntries) {
    var timeMap = [[]];
    //sort the events by dating time
    eventEntries.sort(function(a,b) {
        return a.time - b.time;
    });

    getAllPathTime();
    var route = [];
	var nullroute = [];
    for (var i=0; i<eventEntries.length; ++i) {
       if (eventEntries[i].time != null) route.push(i);
		if (eventEntries[i].time == null) nullroute[i] = true;
    }
	
	
	
	//Added by mfy
	for (var i=0;i<eventEntries.length;++i)
	{
		for (var i1=i+1;i1<eventEntries.length;++i1)
			if ((eventEntries[route[i]].time > eventEntries[route[i1]].time)&&(!nullroute[route[i]])&&(!nullroute[route[i1]])) 
				{
					var tmp = route[i];
					route[i] = route[i1];
					route[i1] = tmp;
				}
		}
		
	

    //check the time spent between adjoining events
    for (var i=0; i<route.length-1; ++i) {
       // var x = route[i];
       // var y = route[i + 1];
        //var eX = eventEntries[x];
        //var eY = eventEntries[y];
        if (eventEntries[route[i]].time+ eventEntries[route[i]].duration + getPathTime(route[i], route[i+1]) > eventEntries[route[i+1]].time) {
            if (eventEntries[route[i]].weight == eventEntries[route[i+1]].weight) {
                //throw the warning
                throw Exception("You needs to change your schedule", route[i], route[i+1]);
                return;
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
							var tmp1 = route[i+1];
							route[i+1] = i1; 
							for (var i2 = i + 2;i2<route.length;i2++)
							`{
								var tmp2 = route[i2];
								route[i2] = tmp1;
								tmp1 = tmp2;
							}
							route.push(tmp1);
						}
						}
			
		}
		
    }

    //best Route
    var bestWastedTime = calcWastedTime(eventEntries);
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

    var bestEvent = [];
    for (var i=0; i<bestRoute.length; ++i) {
        bestEvents[i] = eventEntries[bestRoute[i]];
    }
    return bestEvents;
};

