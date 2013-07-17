

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
    //while (timeMap[i][j] === -1);
	

    return timeMap[i][j];
}

//get all path time from baidu
//require eventEntries, timeMap, BMapWalkingRoute
var getAllPathTime = function(i,j,n) {

  	if (j == n) {getPathTime(i+1, i+1, n);return;}
	if (i == n) return;
     var walking = new BMap.WalkingRoute(map);
     walking.setSearchCompleteCallback(function(results) {
         timeMap[j][i] = timeMap[i][j] = results.getPlan(0).getDuration(false);
		 getPathTime(i,j+1,n);
     });
    walking.search(eventEntries[i].position, eventEntries[j].position);
	
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
	for (var i=0;i<route.length;++i)
	{
		var tmp = new Date(eventEntries[route[i]].time);
		tmp.setHours(23-i,59-i,59-i);
		eventEntries[route[i]].time = tmp;
		var tmp1 = new Date();
		tmp1.setSeconds(2);
		eventEntries[route[i]].duration = tmp1;
	}
	
	
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
							eventEntries[i1].time = eventEntries[route[i]].time + eventEntries[route[i]].duration + getPathTime(route[i],i1);
							var tmp1 = route[i+1];
							route[i+1] = i1; 
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
	
	for (var i1 = 0;i1 < eventEntries.length;i1++)
		if ((nullroute[i1])&&(eventEntries[i1].time == null)) 
						{
							eventEntries[i1].time = eventEntries[route[i]].time + eventEntries[route[route.length-1]].duration + getPathTime(route[route.length-1],i1);
							route.push(i1);
							break;
						}
	
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
    var bestEvent = [];
    for (var i=0; i<route.length; ++i) {
        bestEvent[i] = eventEntries[route[i]];
    }
    return bestEvent;
	
};

//tour stub
//var tour = function(events) {
	//alert(events[0].time);
  //  return events;
//}
