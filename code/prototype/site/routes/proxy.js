
/*
 * GET home page.
 */
var cache = require('memory-cache');
var URI = require("uri-js");
var http = require('http');
var STAY_TIME = 60 * 1000 * 60 *24 ;// 60s * 60 *24

exports.all = function( req , res , next ){
    var url = req.url
    //console.log( url )
    url=url.replace('/proxy/','')
    if ( testURL(url) )
	retrievePage( req , res , next )
    else
	res.redirect(url)
}
var testURL = function( url ){
    return url.indexOf("js")!=-1 || url.indexOf("mapslt")!=-1 ||
     url.indexOf("vt")!=-1 || url.indexOf('flight+')!=-1 ||
     url.indexOf('weather+')!=-1 ;
}
var replaces = ["(http|https)://\\w+.googleapis.com/",
   "http://maps.gstatic.com/",
   "http://maps.gstatic.com/cat_js/intl/en_us/mapfiles/api-3/13/10/%7Bmain,places,weather%7D.js",
   "http://maps.googleapis.com/maps/api/js?key=AIzaSyBxGLmTa_KJutZZEttdAw6PGuuM3030I2I&sensor=true&libraries=places,weather"
    ];
var repl_reg = [];
var init_regex = function(){
    for ( var i in replaces ){
	repl_reg.push( new RegExp( replaces[i] , 'g' ) )
	}
}
init_regex();
var replaceStr = function (data ){
    for ( var i in replaces )
	data = data.replace( repl_reg[i] , "/proxy/$&" )
    return data;
}
var retrievePage = function( req , res , next ){
    var url = req.url
    url=url.replace('/proxy/','')
    var result = null;
    if ( ( result = cache.get(url) ) != null ){
	res.header('Content-Type', cache.get("_CT_"+url) )
	console.log( "cache hit" )
	return res.end( result , 'binary' )
    }
    pullrequest( req , res , next )
}
var pullrequest = function( req , res , next ){
    var url = req.url
    url=url.replace('/proxy/','')
    var options = URI.parse( url )
    if ( options.query && options.query!="")
	options.path += "?"+options.query;
    options.headers={
	'Accept':'text/html,application/xhtml+xml,application/xml,image/webp,*/*;q=0.9,*/*;q=0.8',
	'Cache-Control':'no-cache',
	'User-Agent':'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36',
	'Cookie':'PREF=ID=4283a9fde3f4e7db:FF=0:LD=en:NW=1:CR=2:TM=1375758640:LM=1375761304:S=a3w1H4jLXiAtVrkw; '
    }
    //console.log( options )
    callback = function(response) {
	response.setEncoding('binary')
	  var str = '';
	  response.on('data', function (chunk) {
	    str += chunk;
	  });
	  response.on('end', function () {
	    //console.log( str )
	    str = replaceStr( str )
	    var ct = response.headers["content-type"]
	    console.log( ct )
	    res.header('Content-Type',ct)
	    res.end( str ,'binary' )
	    cache.put( url , str , STAY_TIME )
	    cache.put( "_CT_"+url , ct , STAY_TIME )
	  });
	}
    http.request(options, callback).end();
}

