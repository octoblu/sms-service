var express = require('express'),
  http = require('http'),
  https = require('https'),
  path = require('path'),
  fs = require('fs'),
  config = require('./config/config'),
  morgan = require('morgan'),
  passport = require('passport'),
  methodOverride = require('method-override'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  errorHandler = require('errorhandler'),
  skynet = require('skynet'),
  privateKey = fs.readFileSync('config/server.key', 'utf8'),
  certificate = fs.readFileSync('config/server.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate};
var port = process.env.SMS_PORT || 9009;
var sslPort = process.env.SMS_SECURE_PORT || 9010;

app = express();
app.use(bodyParser());
passport.use(require('./config/local'));
app.use(session({resave: true, saveUninitialized: true, secret: 'sqrt0fSaturn'}));
app.use(morgan('combined'));
app.use(methodOverride());
app.use(errorHandler());
app.use(express.static(path.join(__dirname, 'public')));

var meshbluAuth = require('./middleware/meshblu-auth');

var SendSMSController = require('./controllers/send-sms-controller');
var sendSMSController = new SendSMSController(config);


app.post('/message', meshbluAuth.authenticate,  sendSMSController.sendSMSMessage);
app.get('/message/:id', meshbluAuth.authenticate,  sendSMSController.getSMSMessage);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(port, function () {
  console.log('Listening on port ' + port);
});

httpsServer.listen(sslPort, function () {
  console.log('HTTPS listening on', sslPort);
});




















