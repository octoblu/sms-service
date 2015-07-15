var smsConfig = {
  plivo : {
    authId : process.env.PLIVO_AUTH_UUID,
    authToken : process.env.PLIVO_AUTH_TOKEN,
    srcNumber : '18583650671'
  }
};

module.exports = smsConfig;
