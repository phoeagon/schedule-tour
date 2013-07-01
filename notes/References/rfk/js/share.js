function twitter_code(){
    return "<a href=\"#\" onclick=\"javascript:twitter_window()\" ><img src=\"./img/share/twi.jpg\" alt=\"twitter\" style=\"width:40px;height:40px;\" /></a>";
}
function twitter_window( ){
    var url = getCurrentURL();
    var modern = $('#modern_score').html();
    var classic = $('#classical_score').html();
    var text = "I've got a score of "+ classic + " in classics and "+ modern+" of modern mode in game. this game is awesome! : ";
    window.open( "http://twitter.com/home?status=" + escape(text)+" "+ escape(url),'_blank','width=450,height=400'  );
    
}
function fanfou_code( ){
    return "<a href=\"#\" onclick=\"javascript:fanfou_window()\" ><img src=\"./img/share/fanfou.png\" alt=\"twitter\" style=\"width:40px;height:40px;\" /></a>"
    ;
}
function weibo_code( ){
    return "<a href=\"#\" onclick=\"javascript:weibo_window()\" ><img src=\"./img/share/weibo.jpg\" alt=\"twitter\" style=\"width:40px;height:40px;\" /></a>"
    ;
}
function facebook_code( ){
    return "<a href=\"#\" onclick=\"javascript:facebook_window()\" ><img src=\"./img/share/facebook.jpg\" alt=\"twitter\" style=\"width:40px;height:40px;\" /></a>"
    ;
}
function fanfou_code( ){
    return "<a href=\"#\" onclick=\"javascript:fanfou_window()\" ><img src=\"./img/share/fanfou.png\" alt=\"twitter\" style=\"width:40px;height:40px;\" /></a>"
    ;
}
function fanfou_window(){
    var url = getCurrentURL();
    var modern = $('#modern_score').html();
    var classic = $('#classical_score').html();
    var title = $("title").html();
    var text = "I've got a score of "+ classic + " in classics and "+ modern+" of modern mode in game. this game is awesome! : ";
    window.open( "http://fanfou.com/sharer?u="+escape(url)+ "&t="+encodeURIComponent(title)+"&d="+encodeURI(text)+"&s=bm",'_blank','width=550,height=400'  );
}
function weibo_window(){
    var url = getCurrentURL();
    var modern = $('#modern_score').html();
    var classic = $('#classical_score').html();
    var title = $("title").html();
    var text = "I've got a score of "+ classic + " in classics and "+ modern+" of modern mode in game. this game is awesome! : ";
    window.open( "http://v.t.sina.com.cn/share/share.php?title="+encodeURIComponent(title+":"+text) + '&url='+encodeURIComponent(url)+'&source=bookmark','_blank','width=550,height=400'  );
}
function facebook_window(){
    var url = getCurrentURL();
    var modern = $('#modern_score').html();
    var classic = $('#classical_score').html();
    var title = $("title").html();
    var text = "I've got a score of "+ classic + " in classics and "+ modern+" of modern mode in game. this game is awesome! : ";
    window.open( "http://www.facebook.com/sharer/sharer.php?src=bm&v=4&u="+encodeURIComponent(url)+'&t='+escape(title+':'+text),'_blank','width=550,height=400'  );
}
$(document).ready(function(){
    var modern = $('#modern_score').html();
    var classic = $('#classical_score').html();
    var url = getCurrentURL();
    $('#scoreboard_share').html(
        facebook_code(  ) + "&nbsp;" +
        twitter_code(  ) + "<br/>" +
        fanfou_code(  )  + "&nbsp;" +
        weibo_code( )         
    );
});
