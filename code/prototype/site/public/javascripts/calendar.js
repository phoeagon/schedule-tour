var calendarRenderer = {};

calendarRenderer.render = function(){
	    $.get('html.calender',function(data){
		//$('#calendar').html(data);
		if (globalEventCache)
		    var events = globalEventCache.eventEntries;
		else
		    var events = [];
		var feed = [];
		for ( var e in events ){
		    feed.push( { title: events[e].title ,
				 start: new Date(events[e].time) ,
				 end: moment(events[e].time).add('hour',1).toDate() ,
				 //tmp, assume an hour
				 allDay: false
				 // assume not allday
			     })
		}
		console.log( "feed=");
		console.log( feed );
		$('#calendar').fullCalendar({
			    header: {
				    left: 'prev,next today',
				    center: 'title',
				    right: 'month,agendaWeek,agendaDay'
			    },
			    events : feed , 
			    eventClick: function(event) {
				    // opens events in a popup window
				    window.open(event.url, 'gcalevent', 'width=700,height=600');
				    return false;
			    },
			    
			    loading: function(bool) {
				    if (bool) {
					    $('#loading').show();
				    }else{
					    $('#loading').hide();
				    }
			    }
			});
	    });
}


$(document).ready(   calendarRenderer.render    )
