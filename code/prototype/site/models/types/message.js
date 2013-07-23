var mongoose = require('../mongoose');

//schema of Message
var MessageSchema = mongoose.Schema({
    userFrom    :   {type: String, ref: 'users'},
    userTo      :   {type: String, ref: 'users'},
    content     :   String,
    datetime    :   Date,
    read        :   Boolean
});

var SCHEMA_NAME = 'Message';
//compile into a model
var Message = mongoose.model(SCHEMA_NAME, MessageSchema);

//export module
module.exports = Message;
