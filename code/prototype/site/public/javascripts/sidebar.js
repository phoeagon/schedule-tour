
var Sidebar = (function() {
    //TODO: fix sidebar cancel
    //

    var configAddEvent = function() {

    };

    var showSidebar = function() {
        //
        $('#sidebarCancel').click(function() {
            Sidebar.hideSidebar();
        });
        $('#pickPlace').click(function() {
            Sidebar.hideSidebar();
            var calendarState = CalendarBar.hideCalendarBar();
            ScheduleTour.pickPlace(calendarState, Sidebar.pickPlaceCallback);
        });
        var state = !$('#sidebar').is(':hidden');
        $('#sidebar').show('slide', {direction: 'right'}, 1000); 
        return state;
    };

    var hideSidebar = function() {
        //
        var state = !$('#sidebar').is(':hidden');
        $('#sidebar').hide('slide', {direction: 'right'}, 1000);
        /*
        setTimeout( function(){
            $("#map").css({'left' : '0'});
            $('#map').removeClass('disabledColor');
            $('#map_pad').removeClass('inUse');
        },1000)
        */
        return state;
    };

    var pickPlaceCallback= function(calendarState, place, latLng) {
        if (calendarState) {
            CalendarBar.showCalendarBar();
        }
        Sidebar.showSidebar();
        $('#newPlace').val(place);
        $('newLat').val(latLng.lat());
        $('newLng').val(latLng.lng());
    };

    return {
        showSidebar    :   showSidebar,
        hideSidebar    :   hideSidebar,
        pickPlaceCallback: pickPlaceCallback
    };

}());

var CalendarBar = (function() {
    var showCalendarBar = function() {
        //
        var state = !$('#calendar').is(':hidden');
        $('#calendar').slideDown(); 
        return state;
    };

    var hideCalendarBar = function() {
        //
        var state = !$('#calendar').is(':hidden');
        $('#calendar').slideUp(); 
        return state;
    };

    var toggleCalendarBar = function() {
        $('#calendar').toggle();
    };

    return {
        showCalendarBar    :   showCalendarBar,
        hideCalendarBar    :   hideCalendarBar,
        toggleCalendarBar   :   toggleCalendarBar
    };
}());

