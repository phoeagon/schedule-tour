$( "#add_event_gesture_dialog" ).dialog({
    autoOpen: true,
    width: 400,
    buttons: [
        {
            text: "Ok",
            click: function() {
                $( this ).dialog( "close" );
            }
        },
        {
            text: "Cancel",
            click: function() {
                $( this ).dialog( "close" );
            }
        }
    ]
});
$( "#add_event_gesture_dialog" ).dialog( "open" );
$(function() {
    $( ".datepicker" ).datepicker();
    $( ".datetimepicker" ).datetimepicker();
    $( ".slider" ).slider();
});
