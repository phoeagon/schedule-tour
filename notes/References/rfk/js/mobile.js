    $(document).ready(function() {
        //collapsible management
        applyMobileCSS();
    });
    var savedCheckMobileFunction = 0;
    function forceMobile(){
        savedCheckMobileFunction=checkMobile;
        checkMobile=function(){return true;}
        refreshRobotImgCache();         /* re-cache robot Image*/
        applyMobileCSS();               /* apply CSS change*/
        if (gameState == STATE.GAME_STATE_START)
            gameState = STATE.GAME_STATE_NEW; /* new game*/
        alert("Forced Mobile UI");
    }
    function applyMobileCSS(){
        if (checkMobile ()){
            $('#mobile_css').attr('href','./css/mobile.css');
        }
        else $('#mobile_css').attr('href','./css/main.css');
    }

Modernizr.addTest('cssfilters', function() {
    el = document.createElement('div');
    el.style.cssText = Modernizr._prefixes.join('filter' + ':blur(2px); ');
    return !!el.style.length && ((document.documentMode === undefined || document.documentMode > 9));
});
    /*-------------------------------------------*/
    function featureCheck( verbose ){
        var info = "";
        var errCount = 0;   var warnCount = 0;
        var warnMsg = [];   var errMsg = [];
        if ( !Modernizr.rgba ){
            warnMsg.push("RGBA");   ++warnCount;
        }
        if ( !Modernizr.localstorage ){
            warnMsg.push("LocalStorage"); ++warnCount;
        }        
        if ( !Modernizr.audio ){
            warnMsg.push("HTML5 Audio"); ++warnCount;
        }
        if ( !Modernizr.svg ){
            warnMsg.push("SVG"); ++warnCount;
        }
        if ( !Modernizr.canvas ||
             !Modernizr.canvastext ){
            errMsg.push("Canvas"); ++errCount;
        }
        if ( !Modernizr.csstransitions ){
            warnMsg.push("CSS Transition");
            ++warnCount;
        }
        if ( !Modernizr.cssanimations ){
            warnMsg.push("CSS Animation");
            ++warnCount;
        }
        if ( !Modernizr.borderimage ){
            errMsg.push("Border Image"); ++errCount;
        }
        if ( !Modernizr.borderradius ){
            warnMsg.push("border radius");
            ++warnCount;
        }
        if ( !Modernizr.inputtypes.range ){
            warnMsg.push("Range tag");
            ++warnCount;
        }
        if ( !Modernizr.input.min ||
            !Modernizr.input.max ||
            !Modernizr.input.step ){
            warnMsg.push("Input Attributes fail");
            ++warnCount;
        }
        if ( !Modernizr.opacity ){
            warnMsg.push("Opacity");
            ++warnCount;
        }
        if ( !Modernizr.cssfilters ){
            warnMsg.push("CSS filters");
            ++warnCount;
        } 
        if ( !errCount && !warnCount ){
            if (!verbose)return true;
            info = "You've passed all tests.\n It's likely that it should run fine.";
        }
        else { 
            /* check for error only */
            info = "Oops!\n Your browser failed the following test:\n";
            while ( errMsg.length )
                info += "\t *"+errMsg.pop()+"*\n";          
            while ( warnMsg.length )
                info += "\t "+warnMsg.pop()+"\n";
            
            if (errCount)
                info += "You might run into serious issues unfortunately.";
            else info += "You might experience minor issues.";
        }
        alert(info);
    }
