var mongoose = require('../mongoose');

//schema of User
var UserSchema = mongoose.Schema({
    name        :   String,
    password    :   String,
    salt        :   Date
});

var SCHEMA_NAME = 'User';
//compile into a model
var User = mongoose.model(SCHEMA_NAME, UserSchema);

//export module
module.exports = User;
