//server should be adequately deployed to test this

var myGCM = require('./models/gcm')
var EventEntry = require('./models/types/eventEntry');
var gcmPair = require('./models/types/gcmpair');

var INTERVAL = 1000 * 60; //every 60 secs

pushGCM = function(){
    //var obj1 = new Date('Wed Aug 07 2013 20:01:05 GMT+0800 (CST)');//test event time
    var obj1 = new Date();
    var obj2 = new Date(obj1.valueOf()+INTERVAL);
    console.log( [ obj1 , obj2 ] );
    EventEntry.find().where('time').gt(obj1.valueOf()).lt(obj2.valueOf())
    .exec( function(err , obj ){
        if ( err )
            console.log( "ERROR!" );
        else{
            if ( obj.length )
                for ( var i in obj ){
                    var event = obj[i] ;
                    console.log( event );
                    gcmPair.findOne( {username : event.user } ,function(err,obj){
                        if ( err || !obj ){
                            console.log("No linked devices");
                        }else{
                            console.log( obj.deviceID );
                            myGCM.send( obj.deviceID , {msg : JSON.stringify(event)} , function(err,result){
                                console.log({ error: err ,
                                            result: result
                                            });
                                } );
                        }
                    })
                }
        }
    })
}
setInterval( pushGCM , INTERVAL );
pushGCM();

