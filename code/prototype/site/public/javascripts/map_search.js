mapSearch = {};
mapSearch.search = function( map , searchFor ){
    var local = new BMap.LocalSearch(map, {
        renderOptions:{map: map, autoViewport:true}
    });
    console.log( local.search )
    local.search( searchFor );
}
mapSearch.callback = function(){
    mapSearch.search( ScheduleTour.getMap() , $('#goto_place').val() );
}
mapSearch.setSearchBarCallback = function(){
    //fix ENTER
    $('#search_go').click( mapSearch.callback )
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
