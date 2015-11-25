var config = require('../config/config');
var request = require('request');
var _ = require('lodash');

var SendSMSController = function () {
  var self = this;

  self.sendResponse = function (res, code) {
    return function (error, response, body) {
      if (error) {
        return res.status(code).send(error.message);
      }
      res.json(body);
    }
  };

  self.sendSMSMessage = function (req, res) {
    if ( !(req && req.body && _.isString(req.body.text)) ) {
      return self.sendResponse(res,422)(new Error('body text field is not a string'));
    }

    request({
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Octoblu'
      },
      json: {src: config.plivo.srcNumber, dst: req.body.dst, text: req.body.text.toString()},
      uri: 'https://' + config.plivo.authId + ':' + config.plivo.authToken + '@api.plivo.com/v1/Account/' + config.plivo.authId + '/Message/',
      method: 'POST',
      followAllRedirects: true
    }, self.sendResponse(res,422));
  };

  self.getSMSMessage = function (req, res, next) {

    request({
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Octoblu'
      },
      uri: 'https://' + config.plivo.authId + ':' + config.plivo.authToken + '@api.plivo.com/v1/Account/' + config.plivo.authId + '/Message/' + req.params.id,
      followAllRedirects: true

    }, self.sendResponse(res,500));
  };
  return self;
};

module.exports = SendSMSController;
