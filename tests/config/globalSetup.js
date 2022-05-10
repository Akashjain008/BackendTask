'use strict';

require('@babel/register');

const server = require('../../src/index');

module.exports = async () => {
  global.httpServer = server;
  await global.httpServer.listen();
};