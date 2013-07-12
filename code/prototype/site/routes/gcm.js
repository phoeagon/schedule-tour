
/*
 * GET home page.
 */
var gcm = require('node-gcm');
var myGCM = require('../models/gcm');
var gcmPair = require('../models/types/gcmpair');

exports.index = function(req, res){
  res.render('gcmindex', { title: 'Express' });
};
exports.register = function(req,res){

}
exports.deregister = function(req,res){
}
exports.gcmstatus = function( req , res ) {
    gcmPair.find( {} , function( err , result ){
	console.log( {devices: result } );
	res.render('gcm/gcmStatus', {devices: result || {} } );
    });
}
exports.gcmRegPage = function( req , res ) {
    res.render('gcm/gcmRegistry',{});
}
exports.gcmDeregPage = function( req , res ) {
    res.render('gcm/gcmDeReg',{});
}
exports.gcmDoReg = function( req , res ) {
	console.log( req.body );
    if ( ! req.body/* ||
	 !req.body.deviceID ||
	 !req.body.username*/ )
    {
	res.redirect('/gcmStatus');
	return;
    }
    var deviceID = req.body.deviceID     ;
    var username = req.body.username || 'test';
    console.log( "deviceID: "+deviceID+"\n"+"username: "+username);
    gcmPair.findOne( { username : username } , function(err,obj){
	console.log( "gcmPair.get callback" );
	console.log( obj );
	if (!obj || !obj.deviceID)
	    obj = new gcmPair ( {
		username : username ,
		deviceID : {}
	    })
	obj.deviceID[ deviceID ] = true;
	console.log( obj );
	obj.save( function(err){
	    console.log( err );
	    if( err )
		res.render('gcm/gcmMsg',  { message : " Error!" } );
	    else res.render('gcm/gcmMsg',{message : "success!" } );
	});
	
    });
}
exports.gcmDoDeReg = function ( req , res ) {
    if (! req.body || !req.body.username ){
	res.redirect('/');
	return;
    }
    var username = req.body.username ;
    var deviceID = req.body.deviceID || ""; // "" indicate clear all
    gcmPair.findOne({ username : username } ,  function ( err , obj ) {
	if (err || null===obj){
	    res.render('gcm/gcmMsg',{message:"failed"});
	    return;
	}
	console.log( err );
	if( !obj.deviceID )
	    obj.deviceID = {};
	if ( deviceID === "" )
	    obj.deviceID = {};	//clear
	else delete obj.deviceID[ deviceID ] ;
	for ( var xx in obj.deviceID ){
	    res.render('gcm/gcmMsg',{message:"succeed"});
	    return;
	}
	obj.remove();
	res.render('gcm/gcmMsg',{message:"succeed"});
    });
    
}
exports.gcmSend = function ( req , res ) {
    res.render('gcm/gcmSend');
}
exports.gcmDoSend = function ( req , res ) {
    if (!req.body){
	res.redirect('/gcmStatus');
	return;
    }
    var username = req.body.username ;
    var message = req.body.message;
    console.log( message );
    gcmPair.findOne({username:username},function(err,obj){
	if ( err || !obj ){
	    console.log( "Error encountered in gcmDoSend" );
	    res.redirect("/gcmStatus");
	    return ;
	}
	var myGCM = require('../models/gcm');
	console.log( obj.deviceID );
	myGCM.send( obj.deviceID , {msg : message} , function(err,result){
	    console.log( result );
	    res.render("gcm/gcmMsg",{message: JSON.stringify(result) });
	});
    });
}
