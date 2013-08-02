myPopup = { content : null };


myPopup = function( obj ){
    this.content = obj.content
    //console.log( obj )
    //console.log( this )
    return this;
}
myPopup.prototype.open = function ( a , b ){
    $('#popup_content').html( this.content );
    $('#popup_dialog').removeClass('displaynone')
}
$(document).ready( function(){
    if ( checkMobile() )
        ScheduleTourMap.InfoWindow = myPopup;
    $('#popup_ok_btn').click( function(){
        $('#popup_dialog').addClass('displaynone')
    });
})
