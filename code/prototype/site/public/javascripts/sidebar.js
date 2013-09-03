
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

    var initSidebar = function() {
        $(".datepicker").datetimepicker();
        //switch between date and datatime
        $('#repeatEndInput').datepicker();
        $('#alldayCheckbox').change(function() {
            if (this.checked) {
                var dateFrom = $('#dateFrom').val();
                var dateUntil = $('#dateUntil').val();
                $(".datepicker").datetimepicker('destroy');
                $(".datepicker").datepicker();
                $("#dateFrom").datepicker('setDate', dateFrom);
                $("#dateUntil").datepicker('setDate', dateUntil);
                return;
            }
            var dateFrom = $('#dateFrom').val();
            var dateUntil = $('#dateUntil').val();
            $(".datepicker").datepicker('destroy');
            $(".datepicker").datetimepicker();
            $("#dateFrom").datetimepicker('setDate', dateFrom);
            $("#dateUntil").datetimepicker('setDate', dateUntil);
        });
        //toggle repeat detail div
        $('#repeatCheckbox').change(function() {
            if (this.checked) {
                $('.repeatDetail').show(1000);
                return;
            }
            $('.repeatDetail').hide(1000);
        });
        //toggle repeat detail div
        $('#repeatFrequency').change(function() {
            var text = $(this).find(':selected').text();
            if (text.substr(-2) === 'ly') {
                $('#repeatEvery').slideDown();
                text = (text === 'Daily' ? 'Days' : text.substr(0,text.length-2) + 's');
                $('#repeatEvery span:eq(1)').text(text);
            } else {
                $('#repeatEvery').slideUp('fast');
            }
        });
    };

    return {
        initSidebar     :   initSidebar,
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

