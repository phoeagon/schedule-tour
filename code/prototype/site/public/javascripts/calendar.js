var calendarRenderer = {};

calendarRenderer.render = function(){
    console.log("calendarRenderer.render")
	$.get('html.calender',function(data){
	    var feed = './calendarentries'
	    calendarRenderer.refreshCalendar( feed );
	});
}
calendarRenderer.refreshCalendar = function( feed ){
    console.log( feed );
    $('#calendar').html('');
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
$(document).ready(   calendarRenderer.render    )
