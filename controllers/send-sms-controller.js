var config = require('../config/config');
var request = require('request');

var SendSMSController = function () {
  var self = this;
  self.sendSMSMessage = function (req, res) {

    request({
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Octoblu'
      },
      json: {src: config.plivo.srcNumber, dst: req.body.dst, text: req.body.text.toString()},
      uri: 'https://' + config.plivo.authId + ':' + config.plivo.authToken + '@api.plivo.com/v1/Account/' + config.plivo.authId + '/Message/',
      method: 'POST',
      followAllRedirects: true

    }, function (error, response, body) {
      if (error) {
        return res.status(422).send(error.message);
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
