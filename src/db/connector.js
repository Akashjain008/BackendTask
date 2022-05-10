
'use strict';

const knex = require('knex');

const knexfile = require('../../Knexfile');


const env = process.env.NODE_ENV.trim() || 'development';
const configOptions = knexfile[env];

/**
 * Return middleware that create knex connection
 *
 * @param {Object} [configOptions={}] - Knex configuration.
 * @return {function} Koa middleware.
 * @throws {InvalidRequest} When failed to parse the configOptions 
 */
module.exports = knex(configOptions);
