var mongoose = require('../mongoose');
var Mixed = mongoose.Schema.Types.Mixed;

var gcmPairPrototype = mongoose.Schema({
    username : String ,
    deviceID : Mixed
})
function gcmPair( gcmpair ){
    for (var ele in gcmpair)
        this[ele] = gcmpair[ele];
}

var SCHEMA_NAME = 'gcmPair';
//compile into a model
var gcmPair = mongoose.model(SCHEMA_NAME, gcmPairPrototype);
module.exports = gcmPair;

gcmPair.prototype.setDirty = function(){
    this.markModified('deviceID');
}
