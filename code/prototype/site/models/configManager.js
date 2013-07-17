var config = require('./types/config');

var configManager = {};

module.exports = configManager;

var default_setting = {
    mapStyle : 1
};

configManager.default_setting = default_setting;

/* callback( err , obj )*/
configManager.loadSetting = function( username , callback ){
    if ( username === '' )
        callback( null , default_setting );
    else{
        console.log( "configManager.loadSetting" )
        console.log( username )
        config.findOne( { username : username } , function(err,obj){
            console.log ( obj );
            if ( err || !obj )
                callback( null , default_setting );
            else
                callback( null , obj.setting );
        });
    }
}
configManager.updateSetting = function( username , setting , callback ){
    if ( username === '' )
        callback( null , default_setting );
    else{
        console.log( "configManager.updateSetting" );
        console.log( setting );
        config.findOne( { username : username } , function(err,obj){
            if ( err || !obj )
                obj = new config({username : username , setting : setting});
            else
                obj.setting = setting;
            obj.setDirty();
            obj.save(function(){
                    callback( null , setting );
                });
        });
    }
}
