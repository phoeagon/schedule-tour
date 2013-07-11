var mongoose = require('../mongoose');

//schema of EventEntry
var EventEntrySchema = mongoose.Schema({
    title       :   String,
    description :   String,
    place       :   String,
    weight      :   Number,
    time        :   Date 
});

var TABLENAME = 'EventEntry';
//compile into a model
var EventEntry = mongoose.model( TABLENAME , EventEntrySchema );


//function to test eventEntry
var testEventEntry = function() {
    var ee = new EventEntry({name:'test',place:'SE',time:new Date()});
    ee.save();
    EventEntry.find({}, function(err, obj) {
        console.log( obj );
    });
}

//export module
module.exports = EventEntry;
