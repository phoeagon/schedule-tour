
var Sidebar = (function() {
    //TODO: fix sidebar cancel
    //

    var configAddEvent = function() {

    };
    var submitCallback;
    var currentEvent;

    var safeCb = function(cb) {
        if (cb && (typeof cb == 'function')) return cb;
        return function(){};
    }

    var showSidebar = function(oneEvent, callback) {
        oneEvent = oneEvent || {};
        oneEvent.position = oneEvent.position || [];
        //clone object
        $.extend(true, currentEvent, oneEvent);
        //set init value
        $('#title').val(oneEvent.title || "");
        $('#description').val(oneEvent.description || "");
        $('#newLat').val(oneEvent.position[0] || "");
        $('#newLng').val(oneEvent.position[1] || "");
        $('#weight').slider('value', oneEvent.weight || 0);
        $('#newPlace').val(oneEvent.place || "");
        $('#dateFrom').datetimepicker('setDate', oneEvent.time || new Date());
        $('#dateUntil').datetimepicker('setDate', oneEvent.endTime || new Date());
        if (oneEvent.privacy) {
            $('input:radio[name=privacyRadioGroup][value=private]').attr('checked', true)
        } else {
            $('input:radio[name=privacyRadioGroup][value=public]').attr('checked', true)
        }
        //
        //set callback
        submitCallback = callback || submitCallback;

        var state = !$('#sidebar').is(':hidden');
        $('#sidebar').show('slide', {direction: 'right'}, 1000); 
        return state;
    };

    var hideSidebar = function() {
        //
        var state = !$('#sidebar').is(':hidden');
        $('#sidebar').hide('slide', {direction: 'right'}, 1000);
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
        //bind Submit
        $('#addEventButt').click(function() {
            if ( !validationManager.checkEndTimeAfterStartTime() )
                return;
            currentEvent = currentEvent || {};
            currentEvent.title = $('#title').val();
            currentEvent.description = $('#description').val();
            currentEvent.place = $('#newPlace').val();
            currentEvent.weight = $('#weight').slider('value');
            currentEvent.time = new Date($('#dateFrom').datetimepicker('getDate'));
            currentEvent.endTime = new Date($('#dateUntil').datetimepicker('getDate'));
            currentEvent.duration = new Date($('#dateUntil').datetimepicker('getDate')) - new Date($('#dateFrom').datetimepicker('getDate'));
            currentEvent.position = [parseInt($('#newLat').val()),
                                parseInt($('#newLng').val())];
            currentEvent.privacy = $('input:radio[name=privacyRadioGroup][value=private]').is(':checked');
            /* retain
                addTime     :   new Date(),
                finish      :   false,
                alarms      :   []
                */
            safeCb(submitCallback)(currentEvent);
            Sidebar.hideSidebar();
            submitCallback = null;
            currentEvent = null;
        });
        //bind Cancel
        $('#sidebarCancel').click(function() {
            Sidebar.hideSidebar();
            submitCallback = null;
            currentEvent = null;
        });
        //bind pick up place from map
        $('#pickPlace').click(function() {
            Sidebar.hideSidebar();
            var calendarState = CalendarBar.hideCalendarBar();
            ScheduleTour.pickPlace(calendarState, Sidebar.pickPlaceCallback);
        });
        //set datetimepicker
        $(".datepicker").datetimepicker();
        $(".slider").slider({ step: 1 , min : 0 , max : 10 });

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

