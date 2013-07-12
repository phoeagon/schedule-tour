var mongoose = require('../mongoose');

var eventEntryPrototype = {
    name : String ,
    place : String ,
    time : Date 
};
function eventEntry( eventEntry ) {
    for ( var ele in eventEntry )
        this[ele] = eventEntry[ele];
};
var TABLENAME = 'eventEntry'
module.exports = eventEntry;

var eventEntry = mongoose.model( TABLENAME , eventEntryPrototype );

//var ee = new eventEntry({name:'test',place:'SE',time:new Date()});
//ee.save();
eventEntry.find({},function(err,obj){
    console.log( obj );
})
