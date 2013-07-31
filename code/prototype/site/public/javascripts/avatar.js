avatarManager = {
	formCode : null ,
	init : null ,
	openForm : null
    };
avatarManager.init = function(){
    $.get('/img/avatar_upload',function(data){
	$('#avatar_panel').html( data )
    })
    $('#avatar_div').click ( avatarManager.openForm )
}
avatarManager.openForm = function(){
    $('#avatar_panel').dialog({
	  autoOpen: true,
	    open: function() {  },
	    buttons: [
		{
		    text: "Upload",
		    click: function() {
			$('#avatar_form').submit()
		    } 
		},
		{
		    text: "Close",
		    click: function() {
			$( this ).dialog( "close" );
		    } 
		}
	    ]
      })
}


$(document).ready( function(){
    avatarManager.init()
});
