var smsConfig = {
  plivo : {
    authId : process.env.PLIVO_AUTH_UUID,
    authToken : process.env.PLIVO_AUTH_TOKEN
  },
  meshblu : {
    server : process.env.MESHBLU_SERVER,
    port : process.env.MESHBLU_PORT
  }
};

module.exports = smsConfig;
