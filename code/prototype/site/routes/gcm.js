
/*
 * GET home page.
 */
var gcm = require('node-gcm');
var myGCM = require('../models/gcm');
var gcmPair = require('../models/gcmpair');

exports.index = function(req, res){
  res.render('gcmindex', { title: 'Express' });
};
exports.register = function(req,res){

}
exports.deregister = function(req,res){
}
exports.gcmstatus = function( req , res ) {
    gcmPair.listAll( function( err , result ){
	console.log( {devices: result } );
	res.render('gcm/gcmStatus', {devices: result } );
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
    gcmPair.get( { username : username } , function(err,obj){
	console.log( "gcmPair.get callback" );
	if ( obj ){//already registered
	    res.render('gcm/gcmMsg',{message:"Error!"});
	}else{
	    var tmp = new gcmPair ( {
		deviceID : deviceID , 
		username : username } );
	    //console.log( "var tmp=" );
	    //console.log( tmp );
	    tmp.save( function(err,obj){
		//console.log( err );
		console.log( obj );
		if( err )
		    res.render('gcm/gcmMsg',  { message : " Error!" } );
		else res.render('gcm/gcmMsg',{message : "success!" } );
	    });
	}
    });
}
exports.gcmDoDeReg = function ( req , res ) {
    if (! req.body || !req.body.username ){
	res.redirect('/');
	return;
    }
    var obj = new gcmPair ( { deviceID : "" , 
			      username : req.body.username });
    obj.remove( function ( err , obj ) {
	if (err)
	    res.render('gcm/gcmMsg',{message:"failed"});
	else
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
    gcmPair.get({username:username},function(err,obj){
	if ( err || !obj ){
	    console.log( "Error encountered in gcmDoSend" );
	    res.redirect("/gcmStatus");
	    return ;
	}
	var myGCM = require('../models/gcm');
	//console.log( myGCM );
	myGCM.send( [obj.deviceID] , {msg : message} , function(err,result){
	    console.log( result );
	    res.render("gcm/gcmMsg",{message:result});
	});
    });
}
