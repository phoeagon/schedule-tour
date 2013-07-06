
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

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
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure(function(){
    app.use(express.bodyParser()); 
    app.use(express.cookieParser()); 
    app.use(express.session({ 
        secret: settings.cookieSecret, 
        store: new MongoStore({ 
            db: settings.mongo_db
        }) ,
        cookie: { maxAge: 60000 } 
    }));
      app.use(express.cookieParser('keyboard cat'));
}); 

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var gcmroute = require('./routes/gcm');
app.get('/gcmstatus',gcmroute.gcmstatus);
app.get('/gcmRegistry',gcmroute.gcmRegPage );
app.post('/gcmRegistry',gcmroute.gcmDoReg );
app.get('/gcmDeregistry',gcmroute.gcmDeregPage );
app.post('/gcmDeregistry',gcmroute.gcmDoDeReg );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
