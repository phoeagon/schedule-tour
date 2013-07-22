validationManager = {};

validationManager.applyValidation = function(){
    
    var checkApply=function( testFunc ){
	if ( testFunc() )
	    $("#fix-date-msg").addClass("hidden")
	else $("#fix-date-msg").removeClass("hidden")
    }
    $('#dateUntil').bind( "change" , function(){
	checkApply(validationManager.checkEndTimeAfterStartTime)
    })
    $('#dateFrom').bind( "change" , function(){
	checkApply(validationManager.checkEndTimeAfterStartTime)
    })
}
validationManager.checkEndTimeAfterStartTime = function(){
	var start = new Date($('#dateFrom').val());
	var end = new Date($('#dateUntil').val());
	return ( start.valueOf() <= end.valueOf() );
}
$(document).ready(   validationManager.applyValidation )

