var mongodb = require('../DB');
var mongoose = require('mongoose');

var DBNAME = 'scheduletour'
var TABLENAME = 'eventEntry'
mongoose.connect('mongodb://localhost/'+DBNAME);

var eventEntryPrototype = {
    name : String ,
    place : String ,
    time : Date 
};
function eventEntry( eventEntry ) {
    for ( var ele in eventEntry )
        this[ele] = eventEntry[ele];
};
module.exports = eventEntry;

var eventEntry = mongoose.model( TABLENAME , eventEntryPrototype );

//var ee = new eventEntry({name:'test',place:'SE',time:new Date()});
//ee.save();
