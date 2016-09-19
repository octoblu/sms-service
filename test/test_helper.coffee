chai       = require 'chai'
sinon      = require 'sinon'
sinonChai  = require 'sinon-chai'
chaiSubset = require 'chai-subset'

chai.use sinonChai
chai.use chaiSubset

global.expect = chai.expect
global.sinon  = sinon
