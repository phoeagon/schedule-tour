var getPathTime = function(posX, posY) {
    //stub for getting time from baidu
}

var tour = function(var eventEntries) {
    //sort the events by dating time
    eventEntries.sort(function(a,b) {
        return a.from - b.from;
    });
    //check the time spent between adjoining events
    for (int i=0; i<eventEntries.length-1; ++i) {
        var eX = eventEntries[i];
        var eY = eventEntries[i+1];
        if (eX.from + getPathTime(eX.pos, eY.pos) > eY.from) {
            if (eX.weight == eY.weight) {
                //throw the warning
                throw Exception("You needs to change your schedule", eX, eY);
                return;
            }
            //remove the event with less weight
            eventEntries.splice(
                i + (eX.weight < eX.weight ? 0 : 1),
                1);
            --i;
        }
    }

    var checkFeasibility = function(eventEntries) {
        //check Feasibility of the given route
        for (int i=0; i<eventEntries.length-1; ++i) {
            var eX = eventEntries[i];
            var eY = eventEntries[i+1];
            if (eX.from + getPathTime(eX.pos, eY.pos) > eY.from) {
                return false;
            }
        }
        return true;
    }

    var calcWastedTime = function(eventEntries) {
        //caculate the time wasted
        int wastedTime = 0;
        for (int i=0; i<eventEntries.length-1; ++i) {
            var eX = eventEntries[i];
            var eY = eventEntries[i+1];
            wastedTime += eY.from - eX.from + getPathTime(eX.pos, eY.pos);
        }
        return wastedTime = 0;
    };

    //best Route
    var bestWastedTime = calcWastedTime(eventEntries);
    var bestRoute = eventEntries.slice(0);

    //for each two adjoining events
    for (int i=0; i<eventEntries.length-1; ++i) {
        var newRoute = eventEntries.slice(0);
        //swap
        var swap = newRoute[i];
        newRoute[i] = newRoute[i+1];
        newRoute[i+1] = swap;
        //check Feasibility
        if (!checkFeasibility(newRoute)) break;
        //calc wasted Time
        var newTime = calcWastedTime(newRoute);
        if (newTime < bestWastedTime) {
            //save the better plan
            bestWastedTime = newTime;
            bestRoute = newRoute.slice(0);
        }
    }

    return bestRoute;
};

