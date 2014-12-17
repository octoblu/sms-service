var request = require('request');
var basicAuth = require('basic-auth');
var config = require('../config/config');
module.exports =  {
    authenticate : function(req, res, next){
      var meshbluUser = basicAuth(req);

      if(!meshbluUser){
       return res.send(401, 'No credentials given');
      }

      request({
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Octoblu sms'
        },
        uri: config.meshblu.server + '/authenticate/' + meshbluUser.name,
        followAllRedirects: true,
        qs : {
          token : meshbluUser.pass
        }

      }, function (error, response, body) {
        var parsedBody = JSON.parse(body);
        if (error) {
          return res.send(500, 'Failed to contact meshblu');
        }
        if(!parsedBody.authentication){
          return res.send(401);
        }

        return next();
      });
    }
};

