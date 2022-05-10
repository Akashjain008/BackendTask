const { gql } = require('apollo-server-koa');
const { isAuthorized } = require('../../middleware');
const { combineResolvers } = require("graphql-resolvers");

module.exports.Planet = gql`
  type Planet {
    id: ID
    name: String
    code: String 
    spaceCenters(limit: Int): [SpaceCenter]
  }

  type Query {
    planets(offset: Int = 0, limit: Int = 5): [Planet]
  }
`;

module.exports.PlanetResolvers = {
  Planet: {
    spaceCenters: async (planet, { limit }, { models }) => {
      console.log('planet', limit);
      const space_centers = await models.SpaceCenter.findById({ planet_code: planet.code });
      return space_centers.slice(0, limit);
    },
  },
  Query: {
    planets: combineResolvers(isAuthorized, async (root, { offset, limit }, { models }) => {
      console.log('offset', offset);
      console.log('limit', limit);
      const data = await models.Planet.findAll();
      console.log('data', data);
      const planets = data.slice(offset, limit + offset);
      return planets;
    })
  },
};


