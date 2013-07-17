configClient = {};


configClient.getConfig = function( callback ){
    //$.getJSON('/user.config' ).done( callback );
    $.get('/user.config').done( function( data ){
        console.log( data )
        callback( data )
    });
};
configClient.applyConfig = function( data ){
    console.log( data );
    if ( data == null )
        return;
    if ( data.mapStyle == 1 )
        $('#map').addClass('styledHue');
    else 
        $('#map').removeClass('styledHue');
}
configClient.saveConfig = function( setting ){
    $.post("/user.config", $.param(setting) );
}
