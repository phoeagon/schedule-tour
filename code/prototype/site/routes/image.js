var express = require('express')
var extend = require('xtend')
var app = express();
var fs = require('fs');
var Avatar = require('../models/types/avatar')
/*
 * GET home page.
 */
var success , user , error ;

exports.upload = function ( req  , res , next ){
    console.log("uploader listener");
    console.log ( req.body );
    var path = req.files.files.path;
    var ext = req.files.files.name.split('.').pop().toLowerCase();
    if (ext!=='jpg' && ext!=='jpeg'){
        res.redirect('/');
    }
    console.log ( path );
    fs.readFile(path, function (err, data) {
        if (!err){
            var tmpHolder = new Avatar({
                username: req.body.username ,
                data: data
            });
            tmpHolder.save();
            fs.unlink( path ,function(err){
                console.log( "unlink" );
                console.log ( err );
            } );
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(JSON.stringify({result:"OK"}));
        }else{
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(JSON.stringify({result:"failed"}));
        }
    });

}
exports.display = function ( req  , res , next ){
    console.log("img display");
    var username = req.params.username;
    Avatar.findOne( { name : username } , function( err , obj ){
        if ( err || !obj )
            res.redirect('/img/smiley.jpg');
        else {
            //console.log( obj.value.buffer );
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end( obj.data.buffer );
        }
    });

}
exports.upload_code = function( req , res , next ){
    res.render('uploadAvatar')
}
