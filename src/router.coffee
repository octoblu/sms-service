MessagesController = require './messages-controller'

class Router
  constructor: (options) ->
    {plivo_auth_id, plivo_auth_token, plivo_source_number} = options

    unless plivo_auth_id? && plivo_auth_token? && plivo_source_number?
      throw new Error "plivo_auth_id, plivo_auth_token, and plivo_source_number are required: #{JSON.stringify options}"

    @messagesController = new MessagesController {plivo_auth_id, plivo_auth_token, plivo_source_number}

  route: (app) =>
    app.post '/message', @messagesController.create
    app.post '/messages', @messagesController.create
    app.get '/message/:id', @messagesController.get
    app.get '/messages/:id', @messagesController.get

module.exports = Router
