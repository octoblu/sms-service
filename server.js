var express = require('express'),
  http = require('http'),
  https = require('https'),
  path = require('path'),
  config = require('./config/config'),
  morgan = require('morgan'),
  methodOverride = require('method-override'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  errorHandler = require('errorhandler');
var port = process.env.SMS_PORT || process.env.PORT || 9009;

app = express();
app.use(bodyParser.json());
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

httpServer.listen(port, function () {
  console.log('Listening on port ' + port);
});




















