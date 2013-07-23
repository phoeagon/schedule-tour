var mongoose = require('../mongoose');

//schema of User
var UserSchema = mongoose.Schema({
    _id         :   String,
    password    :   String,
    salt        :   Date,
    friendsTo   :   [{type: String, ref: 'users'}],
    friendsFrom :   [{type: String, ref: 'users'}]
});

var SCHEMA_NAME = 'User';
//compile into a model
var User = mongoose.model(SCHEMA_NAME, UserSchema);

//export module
module.exports = User;
