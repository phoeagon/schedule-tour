$(document).ready( function(){
    $('#avatar_div').click ( function(e){
        console.log ( e )
        $('#menu_div').css('position','absolute')
                .css('top',e.clientY).css('left',e.clientX).removeClass('displaynone');
    } )
    $('#menu').mouseleave( function(){
        $('#menu_div').addClass('displaynone');
    })
    $('#logout_btn').click( function(){
        window.location = '/logout'
    })
})
