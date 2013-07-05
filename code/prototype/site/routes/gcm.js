
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