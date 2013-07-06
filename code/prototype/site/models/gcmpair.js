function gcmPair( gcmpair ){
    this.deviceID = gcmpair.deviceID;
    this.username = gcmpair.username;
}
module.exports = gcmPair;

var COLNAME = 'GCM';

gcmPair.prototype.save = function save( callback , col ){
    var mongodb = require('./DB');
    //object to save
    var obj = {
	deviceID : this.deviceID , 
	username : this.username 
    };
    mongodb.open( function(err,db) {
	if (err){
	    return callback(err);
	}
	//retrieving result set
	db.collection( col || COLNAME , function(err,collection){
	    if (err){
		mongodb.close();
		return callback(err);
	    }
//ensure index
	    collection.ensureIndex("username",{unique:true},function(err){});
//save
	    collection.insert( obj , {safe:true}, function(err,obj){
		mongodb.close();
		callback(err,obj);
	    });
	});
    });
}

gcmPair.get = function get( obj , callback , col ){
    var mongodb = require('./DB');
    mongodb.open( function(err,db){
	if (err){
	    return callback(err);
	}
	db.collection(col || COLNAME,function(err,collection){
	    if (err){
		mongodb.close();
		return callback(err);
	    }
	console.log( obj.username );
//find
	collection.findOne( { username:obj.username },
			    function(err,doc){
				mongodb.close();
				if (doc){
				    var retrieved = new gcmPair( doc );
				    callback( err , retrieved );
				}else{
				    callback( err , null );
				}
			    });
	});
    });
}

gcmPair.prototype.update = function update( callback,col ){
    var mongodb = require( './DB' );
//object to update to
    var obj = {
	deviceID : this.deviceID  ,  
	username : this.username 
    };
    mongodb.open(function(err,db){
	if (err){
	    return callback(err);
	}
//retrieving result set
	db.collection( col || COLNAME , function(err , collection ){
	    if (err){
		mongodb.close();
		return callback(err);
	    }
//create index
	    collection.ensureIndex(col||COLNAME,{unique:true},function(err){});
//save
	    collection.update({ username: obj.username},obj,{save:true},function(err,obj){
		mongodb.close();
		callback(err,setting);
	    });
	});
    });
};


gcmPair.listAll = function listAll( callback , col ){
    var mongodb = require('./DB');
    mongodb.open( function(err,db){
	if (err){
	    return callback(err);
	}
	db.collection(col || COLNAME,function(err,collection){
	    if (err){
		mongodb.close();
		return callback(err);
	    }
	//find
	    collection.find().toArray( 
			    function(err,doc){
				console.log( err );
				console.log( doc );
				mongodb.close();
				if (doc){
				    callback( err , doc );
				}else{
				    callback( err , [] );
				}
			    });
	});
    });
}

gcmPair.prototype.remove = function( callback , col ){

    var mongodb = require( './DB' );
//object to update to
    var obj = {
	deviceID : this.deviceID  ,  
	username : this.username 
    };
    console.log( obj );
    mongodb.open(function(err,db){
	if (err){
	    return callback(err);
	}
//retrieving result set
	db.collection( col || COLNAME , function(err , collection ){
	    if (err){
		mongodb.close();
		return callback(err);
	    }
//create index
	    collection.ensureIndex("username",{unique:true},function(err){});
//save
	    collection.remove({ username: obj.username },function(err,obj){
		console.log( err );
		console.log( obj );
		mongodb.close();
		callback(err,obj);
	    });
	});
    });
};




