/*
 * TODO:
 * 		/proxy/ is cached with too long timeout currently.
 * 		can we achieve Cross Domain AJAX?
 * 		To Implement better display
 * */
flight_info = {};
flight_info.lookup = function( flight ){
	if (!flight)
		flight = 'FM9299';
	var url = '/proxy/http://www.google.com/search?q=airline+status+check+'+flight;
	var div = $('#tmpdiv');
	console.log( url )
	div.load( url , function(){
		var html = $('.g.tpo.knavi.obcontainer').html();
		console.log( html )
		var p = new myPopup( { content: html } )
		p.open();
	})
}
