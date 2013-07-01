var initAudio = false;
var audioType = "";
var volume = 0;
var solo = null;
var soundPool = [];

const MAX_SOUNDS = 9;

var mew1, mew2, mew3 ;
var transSound1 , transSound2 , transSound3;
var didi1 , didi2 , didi3 ;

function setVolume( val , audio ){
    if ( audio==null )
        volume = val;
    else audio.volume=val;
}
function getPlayType(){
    if (solo.canPlayType('audio/mp3')=="maybe")
        return 'mp3';
    else if (solo.canPlayType('audio/ogg')=="maybe")
        return 'ogg';
    return "none";
}
function addBackgroundSolo(){
    solo = document.createElement("audio");
    document.body.appendChild(solo);
    audioType = getPlayType();
    solo.setAttribute("src", "./audio/solo." + audioType);
    solo.loop = false;
    solo.volume = volume;
    solo.play();
}
function initAudioModule(){
    if (initAudio)return;
    initAudio = true;

    volume = .5;
    addBackgroundSolo();
    initSoundPool();
}
function audioHandler(){
    if ( !checkMobile() )
        initAudioModule();
}
function audioStop( audio ){
    audio.pause();
    audio.currentTime = 0;
}
function audioStart( audio ){
    audio.play();
}
function audioFadeIn( audio ){
    audioStart(audio);
    for (var i=0;i<100;++i){
      setTimeout( function(i){
          eval("setVolume("+volume*(i/100.0)+",audio)")
          } ,  i*10 , i);
    }
}
function audioFadeOut( audio ){
    for (var i=0;i<100;++i){
        setTimeout(function(i){
          eval("setVolume("+volume*(1-i/100.0)+",audio)")
          } ,  i*10 , i);
    }
    setTimeout( function(){ audioStop(audio); } , 1000 );
}
function toggleSolo(){
    if (!initAudio)return;
    if ( solo == null )
        addBackgroundSolo();
    if ( solo.volume < 0.1 )
        audioFadeIn( solo );
    else audioFadeOut( solo );
}
$(document).ready(
    function(){
        audioHandler();
    });
function itemLoaded(){
    for (var i=0;i<soundPool.length;++i)
        soundPool[i].element.removeEventListener("canplaythrough",itemLoaded,false); 
}
function initSoundElement( ele , prefix ){
    ele = document.createElement("audio");
    document.body.appendChild(ele);
    ele.setAttribute("src", "./audio/"+prefix+"."+ audioType);

    ele.volume = 0;
    ele.play();
    soundPool.push({name:prefix, element:ele, played:false });

    
}
function initSoundPool(){
    initSoundElement( mew1 , "cat1" );
    initSoundElement( mew2 , "cat1" );
    initSoundElement( mew3 , "cat1" );    
    initSoundElement( didi1 , "di" );    
    initSoundElement( didi2 , "di" );    
    initSoundElement( didi3 , "di" );    
    initSoundElement( transSound1 , "trans" );     
    initSoundElement( transSound2 , "trans" );     
    initSoundElement( transSound3 , "trans" ); 
    for (var i=0;i<soundPool.length;++i)
        soundPool[i].element.addEventListener("canplaythrough",itemLoaded,false);
}
function playSound(sound,volume) { 
    var soundFound = false;
    var soundIndex = 0;
    var tempSound;
    if (soundPool.length > 0) {
        while (!soundFound && soundIndex < soundPool.length) {
            var tSound = soundPool[soundIndex]; 
            if ((tSound.element.ended || !tSound.played) && tSound.name == sound) {
                soundFound = true;
                tSound.played = true;
            } else {
                soundIndex++;
            }
        }
    }
    if (soundFound) {
        tempSound = soundPool[soundIndex].element;
        tempSound.volume = volume;
        tempSound.play();
    }
}
/* redefine play sound effect functions*/
playMew = function(){ playSound("cat1",volume); };
playDi = function(){ playSound("di",volume); };
playTrans = function(){ playSound("trans",volume); };
