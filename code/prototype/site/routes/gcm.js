
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
	res.render('gcm/gcmStatus',{devices: result })
    });
}
exports.gcmRegPage = function( req , res ) {
    res.render('gcm/gcmRegistry',{});
}
exports.gcmDeregPage = function( req , res ) {
    res.render('gcm/gcmDeReg',{});
}
exports.gcmDoReg = function( req , res ) {
    if ( ! req.body ||
	 !req.body.devid ||
	 !req.body.username)
    {
	res.redirect('/gcmStatus');
	return;
    }
    var deviceID = req.body.devid     ;
    var username = req.body.username ;
    gcmPair.get( { username : username } , function(err,obj){
	if ( obj ){
	    res.render('gcm/gcmMsg',{message:"Error!"});
	}else{//already registered
	    var tmp = new gcmPair ( {
		deviceID : deviceID , 
		username : username } );
	    tmp.save( function(err,obj){
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