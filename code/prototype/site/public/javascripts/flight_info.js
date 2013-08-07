/*
 * TODO:
 * 		/proxy/ is cached with too long timeout currently.
 * 		can we achieve Cross Domain AJAX?
 * 		To Implement better display
 * */
flight_info = {};
flight_info.regex = /^([A-Z]{2}|[A-Z]\d|\d[A-Z])[1-9](\d{1,3})?$/
flight_info.test = function( str ){
	var res = str.match( flight_info.regex );
	return res && res.length
}
flight_info.getinfo = function( flight , callback ){
	if (!flight)
		flight = 'FM9299';
	var url = '/proxy/http://www.google.com/search?q='+flight;
	$('#tmpdiv').load( url , function(){
		var html = $('.g.tpo.knavi.obcontainer').html();
		if ( html && html != '' ){
			callback( html )
		}
	})
}
flight_info.lookup = function( flight ){
		flight_info.getinfo( flight , function(html){
			if ( html && html != '' ){
				var p = new myPopup( { content: html } )
				p.open();
			}
		} )
}
