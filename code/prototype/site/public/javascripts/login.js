loginManager = {};
loginManager.displayDialog = function(){
    console.log("display");
    $.get('/login',function(data){
	$( "#login_panel" ).html( data );
	$( "#login_panel" ).dialog({
	    autoOpen: true,
	    width: "90%",
	    buttons: [
		{
		    text: "Log in",
		    click: function() {
			$( "#login_form" ).submit();
		    } 
		},
		{
		    text: "Sign Up",
		    click: function() {
			loginManager.displayRegistrationDialog();
			$( this ).dialog( "close" );			
		    } 
		},
		{
		    text: "Skip",
		    click: function() {
			$( this ).dialog( "close" );
		    }
		}
	    ]
	});
    })
}
loginManager.displayRegistrationDialog = function(){
    console.log("display");
    $.get('/reg',function(data){
	$( "#reg_panel" ).html( data );
	$( "#reg_panel" ).dialog({
	    autoOpen: true,
	    width: "90%",
	    buttons: [
		{
		    text: "Sign Up",
		    click: function() {
			$( "#reg_form" ).submit();
		    } ,
		    class : "btn-primary"
		},
		{
		    text: "Cancel",
		    click: function() {
			$( this ).dialog( "close" );
		    }
		}
	    ]
	});
    })
}
loginManager.testLogin = function(){
    console.log(username);
    if ( username === null )
	loginManager.displayDialog();
}
$(document).ready(   loginManager.testLogin    )

