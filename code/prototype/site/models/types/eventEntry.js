var mongoose = require('../mongoose');
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

//schema of EventEntry
var EventEntrySchema = mongoose.Schema({
    user        :   {type: String, ref: 'users'},
    title       :   String,
    description :   String,
    place       :   String,
    weight      :   Number,
    time        :   Date,
    endTime     :   Date,
    duration    :   Date,
    position    :   [SchemaTypes.Double],
    gps         :   [SchemaTypes.Double],
    alarms      :   [],
    privacy     :   Boolean,
    finished    :   Boolean
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
