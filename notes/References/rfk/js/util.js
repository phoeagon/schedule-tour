function randomInteger( upperbound ){
    return Math.floor(Math.random()* (upperbound + 1) ) ;
}
function randOrd(){
  return (Math.round(Math.random())-0.5);
}


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
shuffle = function(o){ //v1.0
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

	function boundingBoxCollide(object1, object2) {
  
	    
		var left1 = object1.x;
		var left2 = object2.x;
		var right1 = object1.x + object1.width;
		var right2 = object2.x + object2.width;
		var top1 = object1.y;
		var top2 = object2.y;
		var bottom1 = object1.y + object1.height;
		var bottom2 = object2.y + object2.height;
	    
		if (bottom1 < top2) return(false);
		if (top1 > bottom2) return(false);
	    
		if (right1 < left2) return(false);
		if (left1 > right2) return(false);
	    
		return(true);

	};
    function debug_output( text ){
        var o = $('#debug').html();
        $('#debug').html(o+' '+text);
    }
    function getTime(){
        return new Date().valueOf();
    }
    function measureDistance( object  , x , y ){
        var a = object.x - x;
        var b = object.y - y;
        a = (a<0) ? -a : a;
        b = (b<0) ? -b : b;
        //return (a<b) ? a : b;
        return a+b;
    }
    function fireToast( text ) {
        // set Toast
        $('#toast_text').html(text);
        // show the toast
        $('#toast').removeClass('hide');
        //$('#toast').removeClass('transparent');
        // set timeout
        setTimeout( function (){
	    //$('#toast').addClass('transparent');
	    //setTimeout( function(){
		$('#toast').addClass('hide');
		//},1000 );
        } , 2000 );
    }
    var potionEffect = 0;
    function potionEffectNotify( text ){
        ++potionEffect; //notification counter
        $('#potion_notify').html( text );
        $('#potion_effect').removeClass('hide');
        $('#potion_effect').removeClass('transparent');

        setTimeout( function (){
                --potionEffect;
                if (potionEffect==0){
                    // if no more notifications in queue , hide it!
                    $('#potion_effect').addClass('hide');
                }
            } , 4000 );
    }
    var kittenFoundEffect = 0;
    function kittenFoundNotify( ){
        ++kittenFoundEffect; //notification counter
        $('#kitten_found_toast').removeClass('hide');
        $('#kitten_found_toast').addClass('animated fadeInRight');

        setTimeout( function (){
                --kittenFoundEffect;
                if (kittenFoundEffect==0){
                    // if no more notifications in queue , hide it!
                    $('#kitten_found_toast').addClass('hide');
		    $('#kitten_found_toast').removeClass('animated fadeInRight');
                }
            } , 3000 );
    }
    function putScore( score ) {
	$('#score').html ( score );
    }
    function putScoreChange ( score ) {
	var text = "";
	if ( score > 0 )
	    text = "+"+score ;
	else text = "" + score;
	// fade out existing ones
	$('.score_flash:gt(0)').addClass('animated fadeOut');
	// create a new one
	var element = $('.score_flash:first')
	    .clone();
	element.find('.score_notify').html( text );
	element.removeClass('hide');
	// animation: fade in
	element.addClass('animated fadeInUp');
	element.appendTo('#score_changes');
	// fade out
	setTimeout(	function(){
	    element.removeClass('fadeInUp');
	    element.addClass('fadeOut');
	} , 2000 );
	// remove
	setTimeout(	function(){
	    element.remove();
	} , 4000 );
    }
    function openScreenShot( ){
	var theCanvas = document.getElementById('canvas');
	var dataUrl = theCanvas.toDataURL();
	window.open(dataUrl, "Game Screen", "");
    }
    function setMode( modeId ){
	// clear all ticks
	$('.tick').addClass('hide');
	// set a tick
	$('.tick:eq('+modeId+')').removeClass('hide');
	    //flip
	$('#custom_panel').addClass('animated flip');
	if ( modeId == GLOBAL_PRESET.CUSTOM &&
	    currentMode != GLOBAL_PRESET.CUSTOM ){
	    $('#scoreboard').addClass('hide');
	    $('#custom_div').removeClass('hide');
	}else if( modeId != GLOBAL_PRESET.CUSTOM &&
	    currentMode == GLOBAL_PRESET.CUSTOM ){
	    $('#scoreboard').removeClass('hide');
	    $('#custom_div').addClass('hide');
	}
	setTimeout( function(){
	    $('#custom_panel').removeClass('animated flip');
	} , 1000 );
	currentMode = modeId;
	setModeLocalStorage(modeId);
    }
    const GLOBAL_PRESET = {
	NULL : -1,
	CLASSICAL : 0 ,
	MODERN : 1 ,
	CUSTOM : 2
    }
    var currentMode = GLOBAL_PRESET.NONE;
    
    function getGeneralStorage( tag ){
	if (Modernizr.localstorage)
	    return localStorage.getItem( tag );
	else return null;
    }
    function writeGeneralStorage ( tag , data ){
	if (Modernizr.localstorage)
	    localStorage.setItem( tag , data );
    }
    function getLocalStorage (  ) {
	var data= [];
	if (Modernizr.localstorage) {
	    data = [ localStorage.getItem("classical_score") ,
		     localStorage.getItem("modern_score") ] ;
	    if ( null == data[0] )
		data[0] = 0;
	    if ( null == data[1] )
		data[1] = 0;
	}
	else{
	    data = [ 0 , 0 ];
	}
	return data;
    }
    function writeLocalStorage ( data ) {
	if (Modernizr.localstorage) {
	    localStorage.setItem("classical_score" , data[0] );
	    localStorage.setItem("modern_score" , data[1] );
	}
	else{
	}	
    }
    function checkMobile (){
	var tmp = navigator.userAgent;
	if(/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(tmp)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(tmp.substr(0,4)))
	    return true;
	return false;
    }
    function addResizeListener(){
	$(window).resize( function(){
	    var height = $(window).height();
	    var width = $(window).width();

	    if(width>height) {
		//$("#main_div").removeClass('portrait_div');
	      // Landscape
	    } else {
	      // Portrait
		//$("#main_div").addClass('portrait_div');
	    }
	});
    }

    function showElement( elementId ) {
	$( elementId ).removeClass('hide');
	$( elementId).addClass('animated fadeIn');
	setTimeout(function () {
	    $( elementId ).removeClass('animated fadeIn');
	}, 2000);
    }
    function hideElement( elementId ){
	$(elementId).addClass('animated fadeOut');
	setTimeout(function () {
	    $(elementId).removeClass('animated fadeOut');
	    $( elementId ).addClass('hide');
	}, 2000);
    }


    window.requestAnimFrame = function(){
	return (
	    window.requestAnimationFrame       || 
	    window.webkitRequestAnimationFrame || 
	    window.mozRequestAnimationFrame    || 
	    window.oRequestAnimationFrame      || 
	    window.msRequestAnimationFrame     || 
	    function(/* function */ callback){
		window.setTimeout(callback, 10);
	    }
	);
    }();
    
  //var window.requestAnimationFrame = requestAnimationFrame;

    function toggleMenu(){
	$('#light').toggleClass('hide');
	$('#menu_list').toggleClass('hide');
    }
    function hideMenu(){
	$('#light').addClass('hide');
	$('#menu_list').addClass('hide');
    }
    function showMenu(){
	$('#light').removeClass('hide');
	$('#menu_list').removeClass('hide');
    }

    function getKarma(){
	var tmp = $('#karma_score').text();
	return parseInt(tmp);
    }
    function setKarma( value ){
	return $('#karma_score').text( value );
    }
    function deltaKarma ( delta ){
	var val = getKarma();
	val += delta;
	$('#karma_score').text( val );
	flushKarma();
    }
    function flushKarma(){
	writeGeneralStorage('karma',getKarma());
    }
    function fetchKarma(){
	var value = getGeneralStorage('karma');
	if ( value == null || value=="" )
	    value = "0";
	setKarma( value );
    }
    function restrictModeOptions(){
	if ( !hasSkill('modern') )
	    $('#mode1').addClass('hide');//display:none
	else $('#mode1').removeClass('hide');
	
	if ( !hasSkill('custom') )
	    $('#mode2').addClass('hide');
	else $('#mode2').removeClass('hide');
    }
    function getModeLocalStorage(){
	var tmp = getGeneralStorage('mode');
	if ( null == tmp )
	    return 0;
	else return parseInt(tmp);
    }
    function setModeLocalStorage( mode ){
	writeGeneralStorage('mode',mode);
    }
    function getBrezier( p0 , p1 , p2 , p3 ){
	
	var cx = 3 * (p1.x - p0.x)
	var bx = 3 * (p2.x - p1.x) - cx;
	var ax = p3.x - p0.x - cx - bx;
	var cy = 3 * (p1.y - p0.y);
	var by = 3 * (p2.y - p1.y) - cy;
	var ay = p3.y - p0.y - cy - by;

	var data = [];

	for (var t = 0; t < 1; t+=0.01 ){
	    var xt = ax*(t*t*t) + bx*(t*t) + cx*t + p0.x;
	    var yt = ay*(t*t*t) + by*(t*t) + cy*t + p0.y;
	    data.push({x:xt,y:yt});
	}
	return data;
    }
var stateStack = [];

    function saveGameState(){
	stateStack.push( gameState );
    }
    function popGameState(){
	return stateStack.pop();
    }
    function setPause(){
	saveGameState();
	gameState = STATE.GAME_WAIT_FOR_LOAD;
    }
    function revertPause(){
	gameState = popGameState();
    }
    function togglePanel(){
	$('#panel').toggleClass('hide');
	$('#mode_pad').toggleClass('hide');
    }
    function showPanel(){
	$('#panel').removeClass('hide');
	$('#mode_pad').removeClass('hide');
    }
    function hidePanel(){
	$('#panel').addClass('hide');
	$('#mode_pad').addClass('hide');
    }
    function hideDialogs(){
	    hideCatAcquireNotify();	/* hide previous notifications*/
	    hideCatGallery();
	    hideSkillGallery();
	    hideMenu();
	    hideNotify();
    }
    function getCurrentURL(){
	return window.location;
    }
    var endTime = 0;
    $(window).load(function () {
       endTime = (new Date()).getTime();
    });
    function getPageLoadTime(){
	return (endTime - startTime)/1000.0;	// return by seconds
    }
    function promptAndClearLocalStorage(){
	if (confirm("Are you sure to reset your profile?"))
	    localStorage.clear();  
    }
