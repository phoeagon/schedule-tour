function hideAbout(){
    revertPause();
    $('#about').addClass('animated fadeOut');
    setTimeout( function(){
        $('#about').addClass('hide');
        $('#about').removeClass('animated fadeOut');
    }, 800);
}
function showAbout(){
    setPause();
    $('#about').addClass('animated fadeIn');
    $('#about').removeClass('hide'); 
    setTimeout( function(){
        $('#about').removeClass('animated fadeIn');
    }, 800);
}
function toggleAbout(){
    $('#about').toggleClass('hide'); 
}
/*----------------------------*/
function hideHelp(){
    revertPause();
    $('#detailed_help').addClass('animated fadeOut');
    setTimeout( function(){
        $('#detailed_help').addClass('hide');
        $('#detailed_help').removeClass('animated fadeOut');
    }, 800);
}
function showHelp(){
    setPause();
    $('#detailed_help').addClass('animated fadeIn');
    $('#detailed_help').removeClass('hide'); 
    setTimeout( function(){
        $('#detailed_help').removeClass('animated fadeIn');
    }, 800);
}
function toggleHelp(){
    $('#detailed_help').toggleClass('hide'); 
}
