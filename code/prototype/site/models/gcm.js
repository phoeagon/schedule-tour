gcm = require('node-gcm');

var myGCM = {};

module.exports = myGCM;

myGCM.idSet = {};
myGCM.errorCode = {
    0 : 'success' , 
    1 : 'duplicate' , 
    2 : 'not found' 
};

myGCM.sender = new gcm.Sender('AIzaSyCHpHsHC86Thg_IG8gIygR53jevl4eiWqE');

myGCM.send = function ( idset , msg , callback ){
    console.log('myGCM.send');console.log(msg);
    data = new gcm.Message();
    data.addDataWithObject( msg );
    console.log( data );
    if ( typeof( idset )== 'Array' )
	var _idset = idset ;
    else {
	var _idset = [];
	for (var dev in idset )
	    _idset.push( dev );
    }
    console.log( idset );
    console.log( _idset );
    myGCM.sender.send( data , _idset , 4 , callback );
}
myGCM.register = function ( id , callback ){
    if ( idSet[id] )
	callback( id , idSet , 1 ) ;//duplicate
    else{
	idSet[id] = true;
	callback( id , idSet , 0 );//success
    }
}
myGCM.deregister = function ( id , callback ) {
    if (idSet[id]){
	delete(idSet[id]);
	callback( id , idSet , 0 );
    }else{
	callback ( id , idSet , 2 ) ;
    }
}

