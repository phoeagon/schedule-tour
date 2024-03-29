
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
//  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , flash = require("connect-flash")
  , account = require('./routes/account')
  , eventEntry = require('./routes/eventEntry') 
  , savedPlace = require('./routes/saved.place')
  , message = require('./routes/message')
  , recommend = require('./routes/recommend');

var app = express();
var MongoStore = require('connect-mongo')(express);
var settings = require('./models/dbCredential');

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.configure(function(){
    app.use(express.bodyParser()); 
    app.use(express.cookieParser()); 
    app.use (flash());
    app.use(express.session({ 
        secret: settings.cookieSecret, 
        store: new MongoStore({ 
            db: settings.mongo_db
        }) ,
        cookie: { maxAge: 60000000 } 
    }));
    app.use( function(req,res,next){
        if (!res.getHeader('Cache-Control'))
            res.setHeader('Cache-Control', 'public, max-age=3600000');
        next();
    } )
    //app.use(express.cookieParser('keyboard cat'));
}); 

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.session.success;
    res.locals.error = req.session.error;
    req.session.success = null;
    req.session.error = null;
    next();
});

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

account.setRouter(app);
eventEntry.setRouter(app);
savedPlace.setRouter(app)
recommend.setRouter(app);
message.setRouter(app);

var configRoutes = require('./routes/config');
app.get('/html.calender',function(req,res){
        res.render('calender',{});
    });
app.get('/user.config',configRoutes.getConfig);
app.post('/user.config',configRoutes.saveConfig);
app.get('/', routes.index);
//app.get('/users', user.list);

var gcmroute = require('./routes/gcm');
app.get('/gcmstatus',gcmroute.gcmstatus);
app.get('/gcmRegistry',gcmroute.gcmRegPage );
app.post('/gcmRegistry',gcmroute.gcmDoReg );
app.get('/gcmDeregistry',gcmroute.gcmDeregPage );
app.post('/gcmDeregistry',gcmroute.gcmDoDeReg );
app.post('/gcmDereg',gcmroute.gcmDoDeReg );
app.get('/gcmSend',gcmroute.gcmSend );
app.post('/gcmSend',gcmroute.gcmDoSend );

var imageRouter = require('./routes/image')

app.get('/img/avatar/:username',imageRouter.display)

app.post('/img/upload',eventEntry.checkLogin)
app.post('/img/upload',imageRouter.display)

app.post('/img/avatar_upload',eventEntry.checkLogin)
app.post('/img/avatar_upload',imageRouter.upload)

app.post('/img/avatar_upload_jq',eventEntry.checkLogin)
app.post('/img/avatar_upload_jq',imageRouter.upload_raw)

app.get('/img/avatar_upload',imageRouter.upload_code)
//var eventEntry = require('./models/types/eventEntry');

var proxy = require('./routes/proxy')
app.get( '/proxy/*', proxy.all )
app.get( '/_volatile_proxy/*', function(req,res,next){
        req.url = req.url.replace('/_volatile_proxy/','/proxy/');
        proxy.all( req , res , next );
    } )
/*
 * function replaceURL ( prefix ){
    function to_call( req , res , next ){
        console.log( req.url )
        var url = req.url
        url=url.replace( prefix ,'/proxy/http://www.google.com'+prefix )
        req.url = url;
        console.log( req.url )
        proxy.all( req , res , next );
    }
    return to_call;
}
app.get( '/xjs/_/*' , replaceURL('/xjs/_/')  )
*/


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
