var express = require('express'),
  http        = require('http'),
  https        = require('https'),
path        = require('path'),
fs          = require('fs'),
morgan        = require('morgan'),

methodOverride = require('method-override'),
session        = require('express-session'),
bodyParser     = require('body/any'),
multer         = require('multer'),
errorHandler   = require('errorhandler'),
skynet         = require('skynet'),
privateKey     = fs.readFileSync('config/server.key', 'utf8'),
certificate    = fs.readFileSync('config/server.crt', 'utf8');

var credentials = { key : privateKey, cert: certificate};
var port       = process.env.SMS_PORT || 9009;
var sslPort    = process.env.SMS_SECURE_PORT || 9010;

app = express();


app.use(bodyParser);
app.use(session({resave: true, saveUninitialized: true, secret: 'sqrt0fSaturn'}));
app.use(morgan('combined'));
app.use(methodOverride());
app.use(errorHandler());
app.use(express.static(path.join(__dirname, 'public')));

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(port, function(){
  console.log('Listening on port ' + port);
});

httpsServer.listen(sslPort, function() {
  console.log('HTTPS listening on', sslPort);
});




















