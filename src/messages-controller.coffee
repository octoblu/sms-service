_       = require 'lodash'
request = require 'request'
debug = require('debug')('sms-service:messages-controller')

class MessagesController
  constructor: (options) ->
    {@plivo_auth_id, @plivo_auth_token, @plivo_source_number} = options

    unless @plivo_auth_id? && @plivo_auth_token? && @plivo_source_number?
      throw new Error "plivo_auth_id, plivo_auth_token, and plivo_source_number are required: #{JSON.stringify options}"

  create: (req, res) =>
    debug 'create request', req.body

    options =
      uri: "https://api.plivo.com/v1/Account/#{@plivo_auth_id}/Message/"
      followAllRedirects: true
      auth:
        username: @plivo_auth_id
        password: @plivo_auth_token
      headers:
        'Accept': 'application/json',
        'User-Agent': 'Octoblu'
      json:
        src:  @plivo_source_number
        dst:  req.body.dst
        text: "#{req.body.text}"

    request.post options, (error, response, body) =>
      return res.sendError error if error?
      return res.sendError new Error("Failed to send sms"), response.statusCode if response.statusCode >= 400
      return res.status(201).send body

  get: (req, res) =>
    options =
      uri: "https://api.plivo.com/v1/Account/#{@plivo_auth_id}/Message/#{req.params.id}"
      followAllRedirects: true
      auth:
        username: @plivo_auth_id
        password: @plivo_auth_token
      headers:
        'Accept': 'application/json',
        'User-Agent': 'Octoblu'

    request.get options, (error, response, body) =>
      return res.sendError error if error?
      return res.sendError new Error("Failed to get message"), response.statusCode if response.statusCode >= 400
      return res.status(200).send body

module.exports = MessagesController
