'use strict';

const { AuthenticationError } = require('apollo-server-koa');

// Middleware resolver
const isAuthorized = (parent, args, { authorization }, info) => {
    if (authorization != process.env.AUTHORIZATION_KEY) throw new AuthenticationError("Not Authorized");
};

module.exports = { isAuthorized };