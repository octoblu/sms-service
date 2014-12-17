var express = require('express'),
  path = require('path'),
  config = require('./config/config'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  errorHandler = require('errorhandler');

app = express();
app.set('port', process.env.SMS_PORT || process.env.PORT || 9009);
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler());

var meshbluAuth = require('./middleware/meshblu-auth');

var SendSMSController = require('./controllers/send-sms-controller');
var sendSMSController = new SendSMSController(config);

app.post('/message', meshbluAuth.authenticate,  sendSMSController.sendSMSMessage);
app.get('/message/:id', meshbluAuth.authenticate,  sendSMSController.getSMSMessage);

app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
