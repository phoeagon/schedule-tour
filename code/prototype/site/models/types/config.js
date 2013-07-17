var mongoose = require('../mongoose');

//schema of User
var ConfigSchema = mongoose.Schema({
    username    :   String , 
    setting       :   Object
});

function Config( config ){
    for (var ele in config)
        this[ele] = config[ele];
}

var SCHEMA_NAME = 'Config';
//compile into a model
var Config = mongoose.model(SCHEMA_NAME, ConfigSchema);

//export module
module.exports = Config;

Config.prototype.setDirty = function(){
    this.markModified('setting');
}
