
/*
 * GET users listing.
 */
var configRoutes = {};
module.exports = configRoutes;

configRoutes.getConfig = function(req,res,next){
    var configManager = require('../models/configManager')
    //console.log(configManager);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if ( req.session.user ){
        configManager.loadSetting( req.session.user.name , function( err , setting ){
            res.write(JSON.stringify(setting));
        });
    }else
            res.write(JSON.stringify(configManager.default_setting));
    res.end();
}
configRoutes.saveConfig = function(req,res,next){
    var configManager = require('../models/configManager')
    console.log( req.body );
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if ( req.session.user ){
        var obj = {};
        for ( var ele in configManager.default_setting )
            obj[ele] = req.body[ ele ] ;
        console.log( obj );
        configManager.updateSetting( req.session.user.name , obj , function( err , setting ){
            res.write(JSON.stringify(setting));
        });
    }else
            res.write(JSON.stringify(null));
    res.end();
}

