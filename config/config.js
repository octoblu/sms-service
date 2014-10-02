var smsConfig = {
  plivo : {
    authId : process.env.PLIVO_AUTH_UUID,
    authToken : process.env.PLIVO_AUTH_TOKEN,
    srcNumber : '18583650671'
  },
  meshblu : {
    server : process.env.MESHBLU_SERVER || 'https://meshblu.octoblu.com',
    port : process.env.MESHBLU_PORT || '443'
  }
};

module.exports = smsConfig;
