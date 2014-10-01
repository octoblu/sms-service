var rest = require('rest');
var mime = require('rest/interceptor/mime');
var errorCode = require('rest/interceptor/errorCode');
var basicAuth = require('rest/interceptor/basicAuth');
var config = require('../config/config');
var client = rest.wrap(mime).wrap(errorCode).wrap(basicAuth, {username : config.plivo.authId, password : config.plivo.authToken});

var SendSMSController = function(){
  var self = this;
  self.sendSMSMessage = function(req, res){
    client({
      method: 'POST',
      path: 'https://api.plivo.com/v1/Account/' + config.plivo.authId + '/Message',
      entity : {
        src : config.plivo.srcNumber,
        dst : req.body.dst,
        text : req.body.text
      }
    }).then(function (result) {
      res.send(result.entity);
    })
      .catch(function (errorResult) {
        res.send(errorResult.status.code, 'Error Sending SMS Message!');
      });
  };
  self.getSMSMessage = function(req, res, next){
    client({
      method: 'POST',
      path: 'https://api.plivo.com/v1/Account/' + config.plivo.authId + '/Message/' + req.params.id,
      params : {
        uuid : uuid,
        token : token
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
