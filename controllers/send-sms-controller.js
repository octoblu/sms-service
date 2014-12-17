var rest = require('rest');
var mime = require('rest/interceptor/mime');
var errorCode = require('rest/interceptor/errorCode');
var basicAuth = require('rest/interceptor/basicAuth');
var config = require('../config/config');
var client = rest.wrap(mime).wrap(errorCode).wrap(basicAuth, {username: config.plivo.authId, password: config.plivo.authToken});
var request = require('request');

var SendSMSController = function () {
  var self = this;
  self.sendSMSMessage = function (req, res) {
    request({
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Octoblu',
        'x-li-format': 'json'
      },
      json : {src : config.plivo.srcNumber, dst : req.body.dst, text : req.body.text.toString()},
      uri: 'https://' + config.plivo.authId + ':' + config.plivo.authToken + '@api.plivo.com/v1/Account/' + config.plivo.authId + '/Message/',
      method: 'POST',
      followAllRedirects: true

    }, function (error, response, body) {
      var parsedBody;
      if (error) {
        console.log(error);
        res.send(500, error);
      }

      try {
        parsedBody = JSON.parse(body);
        res.send(parsedBody);
      } catch (err) {
        res.send(200, body);
      }
    });
  };
  self.getSMSMessage = function (req, res, next) {
    client({
      method: 'POST',
      path: 'https://' + config.plivo.authId + ':' + config.plivo.authToken + '@api.plivo.com/v1/Account/' + config.plivo.authId + '/Message/' + req.params.id,
      params: {
        uuid: uuid,
        token: token
      }
    }).then(function (result) {
      res.send(result.entity);
    })
      .catch(function (errorResult) {
        res.send(errorResult.status.code, 'Error Sending SMS Message!');
      });
  };
  return self;
};

module.exports = SendSMSController;
