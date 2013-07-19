validationManager = {};

validationManager.applyValidation = function(){
    var checkEndTimeAfterStartTime = function(){
	var start = new Date($('#dateFrom').val());
	var end = new Date($('#dateUntil').val());
	console.log( start.valueOf() )
	console.log( end.valueOf() )
	if ( start.valueOf() <= end.valueOf() )
	    $("#fix-date-msg").addClass("hidden")
	else $("#fix-date-msg").removeClass("hidden")
    }
    $('#dateUntil').bind( "change" , checkEndTimeAfterStartTime );
    $('#dateFrom').bind( "change" , checkEndTimeAfterStartTime );
}
$(document).ready(   validationManager.applyValidation )

