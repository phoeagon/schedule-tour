mapSearch = {};
mapSearch.search = function( map , searchFor ){
    var local = new BMap.LocalSearch(map, {
        renderOptions:{map: map, autoViewport:true}
    });
    console.log( local.search )
    local.search( "上海" );
}
mapSearch.callback = function(){
    mapSearch.search( map , $('#goto_place').val() );
}
mapSearch.setSearchBarCallback = function(){
    //fix ENTER
    $('form').bind("keydown", function(e) {
      var code = e.keyCode || e.which; 
      if (code  == 13 || code == 10 ) {
        e.preventDefault();
        mapSearch.callback();
        return false;
      }
    });
}
$(document).ready(function(){
    mapSearch.setSearchBarCallback();
})
