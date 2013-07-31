var mongoose = require('../mongoose');

//schema of User
var AvatarSchema = mongoose.Schema({
    _id    :   String , 
    data       :   Object
});

function Avatar( Avatar ){
    for (var ele in Avatar )
        this[ele] = Avatar [ele];
}

var SCHEMA_NAME = 'Avatar';
//compile into a model
var Avatar = mongoose.model(SCHEMA_NAME, AvatarSchema);

//export module
module.exports = Avatar;

Avatar.prototype.setDirty = function(){
    this.markModified('data');
}
