var rest = require('rest');
var mime = require('rest/interceptor/mime');
var errorCode = require('rest/interceptor/errorCode');
var pathPrefix = require('rest/interceptor/pathPrefix');

var basicAuth = require('basic-auth');
var config = require('../config/config');
var client = rest.wrap(mime).wrap(errorCode);
module.exports =  {
    authenticate : function(req, res, next){
      var meshbluUser = basicAuth(req);


      if(!meshbluUser){
        next(new Error('No Credentials Given!'));
      }
      client({
        method: 'GET',
        path: req.protocol + "://" + config.meshblu.server + ':' + config.meshblu.port +  "/authenticate/" + meshbluUser.name,
        params : {
          token : meshbluUser.pass
        }
      }).then(function (result) {
        next();
      })
        .catch(function (errorResult) {
          next('There was an error authenticating with Meshblu');
        });
    }
};

