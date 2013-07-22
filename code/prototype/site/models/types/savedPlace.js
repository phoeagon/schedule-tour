var mongoose = require('../mongoose');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

//schema of EventEntry
var savedPlaceSchema = mongoose.Schema({
    user        :   {type: SchemaTypes.ObjectId, ref: 'users'},
    title       :   String ,
    point       :   Object ,
    zoom        :   Number
});

function savedPlace( gcmpair ){
    for (var ele in savedPlaceSchema)
        this[ele] = savedPlaceSchema[ele];
}

var TABLENAME = 'savedPlace';
//compile into a model
var savedPlace = mongoose.model( TABLENAME , savedPlaceSchema );

savedPlace.prototype.setDirty = function(){
    this.markModified('point');
}
//function to test eventEntry

savedPlace.populate = function( user , title , map ){
    return savedPlace( {
        user : user ,
        title  : title ,
        point  : map.getCenter() ,
        zoom    : map.getZoom()
    } )
}

//export module
module.exports = savedPlace;
