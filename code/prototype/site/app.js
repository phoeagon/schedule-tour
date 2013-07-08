
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , flash = require("connect-flash")
  , account = require('./routes/account');


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
        cookie: { maxAge: 60000 } 
    }));
    //app.use(express.cookieParser('keyboard cat'));
}); 

app.use(function(req, res, next) {
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

account(app);

app.get('/', routes.index);
app.get('/users', user.list);

var gcmroute = require('./routes/gcm');
app.get('/gcmstatus',gcmroute.gcmstatus);
app.get('/gcmRegistry',gcmroute.gcmRegPage );
app.post('/gcmRegistry',gcmroute.gcmDoReg );
app.get('/gcmDeregistry',gcmroute.gcmDeregPage );
app.post('/gcmDeregistry',gcmroute.gcmDoDeReg );
app.get('/gcmSend',gcmroute.gcmSend );
app.post('/gcmSend',gcmroute.gcmDoSend );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
