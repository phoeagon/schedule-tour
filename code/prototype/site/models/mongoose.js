var mongodb = require('./DB');
var mongoose = require('mongoose');

var DBNAME = 'scheduletour'
mongoose.connect('mongodb://localhost/'+DBNAME);

module.exports = mongoose;
