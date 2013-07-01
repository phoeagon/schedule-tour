function hideNotify(){
    $('#notify').addClass('hide');
    $('#notify').removeClass('animated fadeIn');
}
function showNotify( img , text , whole ){
    if ( whole==undefined ){
        $('#notify_img').attr('src',img);
        $('#notify_skill').text( text );
    }else{
        $('#notify_img').attr('src',img);
        $('#notify_text').text( text );        
    }
    $('#notify').addClass('animated fadeIn');
    $('#notify').removeClass('hide');
}
function checkAndShowNotify(){
    var karma = getKarma();
    if ( !hasSkill('modern') && karma > skills[getSkillIdByTag('modern')].cost ){
        showNotify('./img/skill/modern.png','Modern Mode');
    }
    else if ( !hasSkill('custom') && karma > skills[getSkillIdByTag('custom')].cost ){
        showNotify('./img/skill/custom.png','Custom Mode');
    }
}
