avatarManager = {
	formCode : null ,
	init : null ,
	openForm : null
    };
avatarManager.init = function(){
    $('<img>').attr('id','avatar_img')
            .attr('src','/img/avatar/'+username)
            .attr('width','100px')
            .attr('height','100px').appendTo('#avatar_div')

	    
    $.get('/img/avatar_upload',function(data){
	$('#avatar_panel').html( data )
    })
    $('#avatar_btn').click ( avatarManager.openForm )
}
avatarManager.openForm = function(){
    $('#avatar_panel').dialog({
	  autoOpen: true,
	    open: function() {
		$('#avatar_form').attr('style',$('#files').attr('style')) },
	    buttons: [
		{
		    text: "Upload",
		    click: function() {
			var data = $('.fileUploadThumbnails').children(0).children(0).attr('src');
			console.log( data )
			$.post('/img/avatar_upload_jq' , {
			    data : data
			} , function( json ){
			    console.log( json )
			    if ( json.result==='OK' ){
				alert('Uploaded!')
				var dt = new Date();
				$("#avatar_img").attr("src",
				    '/img/avatar/'+username+'?date='+dt.valueOf()
				)
			    }
			    else alert('Failed')
			})
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


$(window).load( function(){
    avatarManager.init()
    $('#avatar_div').draggable({containment: "body", scroll: false});
    $('#menu').menu();
});
