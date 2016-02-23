colors        = require 'colors'
dashdash      = require 'dashdash'
MeshbluConfig = require 'meshblu-config'
Server        = require './server'
Router        = require './src/router'

class Command
  constructor: (@argv) ->
  @OPTIONS: [
    {
      names: ['help', 'h']
      type: 'bool'
      help: 'Print this help and exit.'
    },
    {
      names: ['port', 'p']
      type: 'integer'
      help: 'Port for the server to listen on'
      env: 'PORT'
      default: 80
    },
    {
      names: ['plivo-auth-id', 'i']
      type: 'string'
      help: 'Auth UUID for plivo'
      env: 'PLIVO_AUTH_ID'
    },
    {
      names: ['plivo-auth-token', 't']
      type: 'string'
      help: 'Auth Token for plivo'
      env: 'PLIVO_AUTH_TOKEN'
    },
    {
      names: ['plivo-source-number', 's']
      type: 'string'
      help: 'Source Number for Plivo'
      env: 'PLIVO_SOURCE_NUMBER'
      default: '18583650671'
    },
  ]

  getOptions: =>
    parser = dashdash.createParser {options: Command.OPTIONS}
    options = parser.parse @argv

    options.meshbluConfig = new MeshbluConfig().toJSON()

    if options.help || @isMissingRequiredOptions(options)
      help = parser.help({includeEnv: true}).trimRight()
      console.log """
        usage: node command.js [OPTIONS]\n
        options:\n
        #{help}"""

      console.log colors.red 'meshbluConfig is required' unless options.meshbluConfig
      console.log colors.red 'port is required' unless options.port
      console.log colors.red 'plivo_auth_id is required' unless options.plivo_auth_id
      console.log colors.red 'plivo_auth_token is required' unless options.plivo_auth_token
      console.log colors.red 'plivo_source_number is required' unless options.plivo_source_number

      process.exit 0

    return options

  isMissingRequiredOptions: (options) =>
    return true unless options.meshbluConfig
    return true unless options.port
    return true unless options.plivo_auth_id
    return true unless options.plivo_auth_token
    return true unless options.plivo_source_number
    return false


  panic: (error) =>
    console.error colors.red error.message
    console.error error.stack
    process.exit 1

  run: =>
    {meshbluConfig, port, plivo_auth_id, plivo_auth_token, plivo_source_number} = @getOptions()


    server = new Server {meshbluConfig, port, plivo_auth_id, plivo_auth_token, plivo_source_number}
    server.run (error) =>
      return @panic error if error?

      {address,port} = server.address()
      console.log "Server listening on #{address}:#{port}"

    process.on 'SIGTERM', =>
      console.log 'SIGTERM caught, exiting'
      server.stop =>
        process.exit 0

module.exports = Command
