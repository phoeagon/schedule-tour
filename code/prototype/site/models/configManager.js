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
        config.findOne( { username : username } , function(err,obj){
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
        config.findOne( { username : username } , function(err,obj){
            if ( err || !obj )
                callback( null , default_setting );
            else{
                obj.setting = setting;
                obj.setDirty();
                obj.save(function(){
                        callback( null , setting );
                    });
            }
        });
    }
}
