'use strict';

const { GraphQLScalarType } = require('graphql');

const dateScalar = {
  Date: new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
  })
};

module.exports = dateScalar;