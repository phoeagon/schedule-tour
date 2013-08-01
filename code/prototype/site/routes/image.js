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
   // console.log ( req.body );
    var path = req.files.files.path;
    var ext = req.files.files.name.split('.').pop().toLowerCase();
    if (ext!=='jpg' && ext!=='jpeg'){
        res.redirect('/');
    }
    console.log ( path );
    console.log ( req.session.user  )
    fs.readFile(path, function (err, data) {
        if (!err){
            Avatar.findOne({ _id: req.session.user._id } , function(err,tmpHolder){
                if (tmpHolder == null)
                    var tmpHolder = new Avatar({
                        _id: req.session.user._id ,
                        data: data
                    });
                else tmpHolder.data = data;
                tmpHolder.setDirty();
                tmpHolder.save();
                fs.unlink( path ,function(err){
                    console.log( "unlink" );
                    console.log ( err );
                } );
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({result:"OK"}));
            })
        }else{
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({result:"failed"}));
        }
    });

}
exports.display = function ( req  , res , next ){
    console.log("img display");
    var username = req.params.username;
    Avatar.findOne( { _id : username } , function( err , obj ){
        if ( err || !obj )
            res.redirect('/images/smiley.jpg');
        else {
            console.log( obj.data.buffer );
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end( obj.data.buffer );
        }
    });

}
exports.upload_code = function( req , res , next ){
    res.render('uploadAvatar')
}
exports.upload_raw = function ( req  , res , next ){
    console.log("uploader listener");
    var data = req.body.data.replace(/^data:image\/\w+;base64,/, "");;
    var raw_img = new Buffer(data, 'base64')
    Avatar.findOne({ _id: req.session.user._id } , function(err,tmpHolder){
        if (tmpHolder == null )
            tmpHolder = new Avatar({ _id: req.session.user._id ,
                                     data :  raw_img
            })
        else tmpHolder.data =  raw_img 
        tmpHolder.setDirty();
        tmpHolder.save( function(err){
            if (!err){
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({result:"OK"}));
            }else{
                console.log( err )
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({result:"failed"}));
            }
        })
    })
}
