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
        'User-Agent': 'Octoblu'
      },
      json: {src: config.plivo.srcNumber, dst: req.body.dst, text: req.body.text},
      uri: 'https://' + config.plivo.authId + ':' + config.plivo.authToken + '@api.plivo.com/v1/Account/' + config.plivo.authId + '/Message/',
      method: 'POST',
      followAllRedirects: true

    }, function (error, response, body) {
      if (error) {
        return res.send(500);
      }
      res.json(body);
    });
  };

  self.getSMSMessage = function (req, res, next) {

    request({
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Octoblu'
      },
      uri: 'https://' + config.plivo.authId + ':' + config.plivo.authToken + '@api.plivo.com/v1/Account/' + config.plivo.authId + '/Message/' + req.params.id,
      followAllRedirects: true

    }, function (error, response, body) {
      if (error) {
        return res.send(500);
      }
      res.json(body);
    });
  };
  return self;
};

module.exports = SendSMSController;
