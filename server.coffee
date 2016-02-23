_                  = require 'lodash'
express            = require 'express'
path               = require 'path'
morgan             = require 'morgan'
bodyParser         = require 'body-parser'
errorHandler       = require 'errorhandler'
meshbluHealthcheck = require 'express-meshblu-healthcheck'
meshbluAuth        = require 'express-meshblu-auth'
meshbluRatelimit   = require 'express-meshblu-ratelimit'
Router             = require './src/router'

class Server
  constructor: ({@meshbluConfig, @port, @plivo_auth_id, @plivo_auth_token, @plivo_source_number}) ->
    throw new Error 'meshbluConfig is required' unless @meshbluConfig?
    throw new Error 'port is required' unless @port?
    throw new Error 'plivo_auth_id is required' unless @plivo_auth_id?
    throw new Error 'plivo_auth_token is required' unless @plivo_auth_token?
    throw new Error 'plivo_source_number is required' unless @plivo_source_number?

  address: =>
    @server.address()

  run: (callback) =>
    app = express()
    app.use meshbluHealthcheck()
    app.use morgan 'dev', immediate: false
    app.use errorHandler()
    app.use express.static path.join(__dirname, 'public')
    app.use meshbluAuth()
    app.use meshbluRatelimit()
    app.use bodyParser.urlencoded limit: '50mb', extended : true
    app.use bodyParser.json limit : '50mb'
    app.use (request, response, next) =>
      response.sendError = (error, code=500) =>
        code = error.code if _.isNumber error.code
        return response.sendStatus code unless error.message?
        return response.status(code).send error.message
      next()

    router = new Router {@plivo_auth_id, @plivo_auth_token, @plivo_source_number}
    router.route app

    @server = app.listen @port, callback

  stop: (callback) =>
    @server.close callback

module.exports = Server
