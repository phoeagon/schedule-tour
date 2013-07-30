loginManager = {};
loginManager.displayDialog = function(){
    console.log("display");
    $.get('/login',function(data){
	$( "#login_panel" ).html( data );
	$( "#login_panel" ).dialog({
	    autoOpen: true,
	    //width: "90%",
	    open: function() {
		$(this).bind("keyup",function(e){
		  var code = e.keyCode || e.which; 
		  if (code  == 13 || code == 10 ) {
		    console.log( e )
		    e.preventDefault();
		    $(this).parent().find('button:nth-child(1)').click();
		    return false;
		  }		    
		})
		$('#username').focus()
		$('#password').bind("blur",function(){
		    $(this).parents('.ui-dialog-buttonpane button:eq(0)').focus();
		})
	    },
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
	    //width: "90%",
	    open: function() {
		$(this).bind("keyup",function(e){
		  var code = e.keyCode || e.which; 
		  if (code  == 13 || code == 10 ) {
		    console.log( e )
		    e.preventDefault();
		    $(this).parent().find('button:nth-child(1)').click();
		    return false;
		  }		    
		})
		$('#username').focus()
	    },
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
    console.log('testlogin');
    console.log(username);
    if ( currentAction && currentAction=="reg" )
	loginManager.displayRegistrationDialog();
    else if ( username === null )
	loginManager.displayDialog();
}
$(document).ready(   loginManager.testLogin    )

