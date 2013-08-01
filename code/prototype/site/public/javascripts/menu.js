$(document).ready( function(){
    $('#avatar_div').click ( function(){
        $('#menu_div').removeClass('displaynone');
    } )
    $('#menu').mouseleave( function(){
        $('#menu_div').addClass('displaynone');
    })
    $('#logout_btn').click( function(){
        window.location = '/logout'
    })
})
