function prepareKey( force ){
    //$('canvas').bind("touchstart",function(e){alert("");e.preventDefault();});
    prepareOneNormalKey( ".up_key" , KEY.UP );
    prepareOneNormalKey( ".down_key" , KEY.DOWN );
    prepareOneNormalKey( ".left_key" , KEY.LEFT );
    prepareOneNormalKey( ".right_key" , KEY.RIGHT );
    
    prepareOneFuncKey( ".ctrl_key" , KEY.CTRL );
    prepareOneFuncKey( ".alt_key" , KEY.ALT );
    prepareOneFuncKey( ".shift_key" , KEY.SHIFT );
    prepareOneFuncKey( ".space_key" , KEY.SPACE );

    $('.canvas').touchwipe({
             wipeLeft: function() { releaseAllDirection();normalKeyDown(null,KEY.LEFT,"left"); },
             wipeRight: function() { releaseAllDirection();normalKeyDown(null,KEY.RIGHT,"left"); },
             wipeDown: function() { releaseAllDirection();normalKeyDown(null,KEY.UP,"left"); },
             wipeUp: function() { releaseAllDirection();normalKeyDown(null,KEY.DOWN,"left"); },
             min_move_x: 30,
             min_move_y: 30,
             preventDefaultEvents: true
        });
    /*$('.canvas').bind('tap',function(e){releaseAllDirection();e.preventDefault();});*/
    
        if (!Modernizr.touch && force==undefined ){
            $('.keyboard').addClass('hide');
            return;
        }
}
    function prepareOneNormalKey( keyTag , keyCode ){
        $(keyTag).addClass("rounded-corners");
        $(keyTag).bind("touchstart", function (event) {
            normalKeyDown( event , keyCode , keyTag );      event.preventDefault();
        });
        $(keyTag).bind("touchend", function (event) {
            normalKeyUp( event , keyCode , keyTag );      event.preventDefault();
        });
    }
    function prepareOneFuncKey( keyTag , keyCode ){
        $(keyTag).addClass("rounded-corners");
        $(keyTag).bind("touchstart", function (event) {
            funcKeyDown( event , keyCode , keyTag );      event.preventDefault();
        });
        $(keyTag).bind("touchend", function (event) {
            funcKeyUp( event , keyCode , keyTag );      event.preventDefault();
        });

    }

    function normalKeyPress( event , keyCode , keyTag ){
        normalKeyDown( event , keyCode , keyTag );
        setTimeout( function(){normalKeyUp( event , keyCode , keyTag );},1000);
    }
    function normalKeyDown( event , keyCode , keyTag ){
        $(keyTag).removeClass("pinkKey");
        $(keyTag).addClass("redKey");
        keyPressList [ keyCode ] = true;  
    }
    function normalKeyUp( event , keyCode , keyTag ){
        $(keyTag).removeClass("redKey");
        $(keyTag).addClass("pinkKey");
        keyPressList [ keyCode ] = false; 
    }
    function funcKeyDown( event , keyCode , keyTag ){
        $(keyTag).removeClass("blueKey");
        $(keyTag).addClass("redKey");
        keyPressList [ keyCode ] = true;  
    }
    function funcKeyUp( event , keyCode , keyTag ){
        $(keyTag).removeClass("redKey");
        $(keyTag).addClass("blueKey");
        keyPressList [ keyCode ] = false; 
    }
    function releaseAllDirection(){
        keyPressList [ KEY.UP ] = false;
        keyPressList [ KEY.DOWN ] = false;
        keyPressList [ KEY.LEFT ] = false;
        keyPressList [ KEY.RIGHT ] = false;
    }
    function showKeyboard(){
        $('.keyboard').removeClass('hide');
    }
    function hideKeyboard(){
        $('.keyboard').addClass('hide');
    }
    function toggleKeyboard(){
        $('.keyboard').toggleClass('hide');
    }
