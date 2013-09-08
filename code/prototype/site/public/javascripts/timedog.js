var TimeDog = (function() {
    var timer;
    var intervals = {};
    var indexer = 0;

    var safeCb = function(cb) {
        if (cb && (typeof cb == 'function')) return cb;
        return function(){};
    }

    var checkTime = function() {
        var now = new Date();
        var hour = now.getHours();
        for ( i in intervals ) {
            var obj = intervals[i];
            if (!obj) continue;
            if (hour < obj.fromHour) continue;
            if (hour >= obj.toHour) continue;
            safeCb(obj.callback)();
        }
    };

    var start = function() {
        if (timer) return;
        timer = setInterval(checkTime, 5000);
    };
    var stop = function() {
        clearInterval(timer);
        timer = null;
    };
    var addInterval = function(fromHour, toHour, callback, id) {
        if (id) {
            intervals[id] = {fromHour:fromHour, toHour:toHour, callback:callback};
            return id;
        }
        ++indexer;
        intervals[indexer] = {fromHour:fromHour, toHour:toHour, callback:callback};
        return indexer;
    };
    var clearInterval = function(index) {
        delete intervals[index];
    };
    var clearAllIntervals = function() {
        delete intervals;
        intervals = {};
    };

    return {
        start   :   start,
        stop    :   stop,
        addInterval:addInterval,
        delInterval:clearInterval,
        delAllIntervals:clearAllIntervals
    };
    
}());
