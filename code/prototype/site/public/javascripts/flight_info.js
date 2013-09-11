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
		flight = 'flight+status+check+FM9299';
	var url = '/_volatile_proxy/http://www.google.com/search?q='+flight;
	$.get( url , function( data ){
		//console.log( data )
		var html = $(data).find('.g.tpo.knavi.obcontainer').html();
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
