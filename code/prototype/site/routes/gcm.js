
/*
 * GET home page.
 */
gcm = require('node-gcm');
myGCM = require('../models/gcm');

exports.index = function(req, res){
  res.render('gcmindex', { title: 'Express' });
};
exports.register = function(req,res){

}