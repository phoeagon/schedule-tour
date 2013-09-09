var calendarRenderer = {};

calendarRenderer.render = function(){
    console.log("calendarRenderer.render")
	$.get('html.calender',function(data){
	    var feed = './calendarentries'
	    calendarRenderer.refreshCalendar( feed );
	});
}
calendarRenderer.refreshCalendar = function( feed, addEvent ){
    console.log( feed );
    $('#calendar').html('');
    $('#calendar').fullCalendar({
        ignoreTimezone: false,
        defaultView: 'agendaDay',
	header: {
		left: 'prev,next today',
		center: 'title',
		right: 'month,agendaWeek,agendaDay'
	},
    selectable: true,
    selectHelper: true,
    select: function(start, end, allDay) {
        console.log('selected:' + start + ' ' + end + ' ' + allDay);
        $('#calendar').fullCalendar('unselect');
        /*
        calendar.fullCalendar('renderEvent',
            {
                title: title,
                start: start,
                end: end,
                allDay: allDay
            },
            true // make the event "stick"
        );
        */
        ScheduleTour.addEventFromTime(start, end);
    },
    editable: true,
    events : feed , 
	eventClick: function(event) {
		// opens events in a popup window
		//window.open(event.url, 'gcalevent', 'width=700,height=600');
        var theEvent = ScheduleTour.findEventBy_id(event.id);
        Sidebar.showSidebar(theEvent, function(newEvent) {
            newEvent._id = event.id;
            ScheduleTour.updateEventCallback(newEvent);
        });
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
    $('#calendar').fullCalendar('today');
}
calendarRenderer.refresh = function(){
    calendarRenderer.render();	//refresh
}
calendarRenderer.addEvent = function( event ){
    calendarRenderer.render();	//refresh
}
calendarRenderer.updateEvent = function( event ){
}
calendarRenderer.deleteEvent = function( event ){
}
$(window).load(   calendarRenderer.render    )
