// const { makeExecutableSchema } = require('graphql-tools');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { gql } = require('apollo-server-koa');
const merge = require('lodash/merge');
const { Planet, PlanetResolvers } = require('./types/planet');
const { SpaceCenter, SpaceCenterResolvers } = require('./types/spaceCenter');
const { Flight, FlightResolvers } = require('./types/flight');
const { Booking, BookingResolvers } = require('./types/booking');
const {dateScalar } = require('../utils/graphqlutil');

const Query = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    null: Boolean
  }
`;

const SchemaDefinition = gql`
  schema {
    query: Query
    mutation: Mutation
  }
`;

module.exports = makeExecutableSchema({
  typeDefs: [
    SchemaDefinition,
    Planet,
    SpaceCenter,
    Flight,
    Booking
  ],
  resolvers: merge(
    PlanetResolvers,
    SpaceCenterResolvers,
    FlightResolvers,
    dateScalar,
    BookingResolvers
  ),
});
