// import knex from 'knex';
// import knexfile from '../../Knexfile';

// export default knex(knexfile[process.env.NODE_ENV || 'development']);


const knex = require('knex');

const knexfile = require('../../Knexfile');


const env = process.env.NODE_ENV.trim() || 'development';
console.log('env',env);
console.log('knexfile',knexfile);
const configOptions = knexfile[env];
console.log('configOptions',configOptions);
// knex.raw('CREATE DATABASE IF NOT EXISTS ??', 'Strapi')
module.exports = knex(configOptions);
