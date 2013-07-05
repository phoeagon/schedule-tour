gcm = require('node-gcm');

var myGCM = {};
exports= myGCM;

myGCM.idSet = {};
myGCM.errorCode = {
    0 : 'success' , 
    1 : 'duplicate' , 
    2 : 'not found' 
};

myGCM.sender = new gcm.Sender('myGoogleAPIKey');

myGCM.send = function ( idset , msg , callback ){
    data = new gcm.Message();
    data.addDataWithObject( msg );
    myGCM.sender.send( data , idset , 4 , callback );
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