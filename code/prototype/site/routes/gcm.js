
/*
 * GET home page.
 */
gcm = require('node-gcm');

exports.index = function(req, res){
  res.render('gcmindex', { title: 'Express' });
};
exports.register = function(req,res){

}