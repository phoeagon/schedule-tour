var settings = require('./dbCredential');
//var gcmPair = require('./gcmPair');
//var gcm = require('./gcm');

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var mongoDBinstance = function(){
    return new Db(settings.mongo_db,
            new Server(settings.mongo_host, Connection.DEFAULT_PORT, {}),{safe:true}
            );
}
module.exports = mongoDBinstance() ;



