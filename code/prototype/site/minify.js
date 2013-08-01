var compressor = require('node-minify')
var fs = require('fs');


compressit = function(filename){
    callback = function (err){
        if (err){
            console.log(" failed, rolling back "+filename )
            var spawn = require('child_process').spawn,
            cp = spawn('cp', [filename, dest]);
        }
    }
    
    var ext = filename.substring( filename.lastIndexOf('.')+1 )
    var dest = filename.replace('public/','public.min/');
    var opts = {
            fileIn: filename,
            fileOut: filename.replace('public/','public.min/'),
            callback: callback
        }
    if ( ext === "js" ){
        opts.type='gcc'
        new compressor.minify(  opts );
    }
    else if (ext==="css"){
        opts.type='yui-css'
        new compressor.minify(  opts  );
    }
}
process.argv.forEach(function (val, index, array) {
  //console.log(index + ': ' + val);
  if (index > 1 ){
      compressit( val );
  }
});
