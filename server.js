var express = require('express'),
  path = require('path'),
  config = require('./config/config'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  errorHandler = require('errorhandler');

var meshbluHealthcheck = require('express-meshblu-healthcheck');

app = express();
app.set('port', process.env.SMS_PORT || process.env.PORT || 80);
app.use(meshbluHealthcheck());
app.use(bodyParser.json());
app.use(morgan('dev', { skip: function(req, res){ return res.statusCode < 400 }}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler());

var meshbluAuth = require('express-meshblu-auth');
app.use(meshbluAuth({
  server: 'meshblu.octoblu.com',
  port: 443,
  protocol: 'https'
}));

var meshbluRatelimit = require('express-meshblu-ratelimit');
app.use(meshbluRatelimit());

var SendSMSController = require('./controllers/send-sms-controller');
var sendSMSController = new SendSMSController(config);

app.post('/message',  sendSMSController.sendSMSMessage);
app.get('/message/:id',  sendSMSController.getSMSMessage);

app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

process.on('SIGTERM', function() {
  console.log('SIGTERM caught, exiting');
  process.exit(0);
});
