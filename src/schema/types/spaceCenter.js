const { gql, UserInputError, ApolloError } = require('apollo-server-koa');
const { isAuthorized } = require('../../middleware');
const { combineResolvers } = require("graphql-resolvers");

module.exports.SpaceCenter = gql`
  type SpaceCenter {
    id: ID
    uid: String
    name: String
    description: String 
    planet: Planet
    latitude: Float
    longitude: Float
  }
  
  type pagination {
    total: Int
    page: Int
    pageSize: Int
  }

  type SpaceCenterSuccess {
    pagination: pagination
    nodes: [SpaceCenter]
  }

  type Query {
    spaceCenters(page: Int = 1, pageSize: Int = 10): SpaceCenterSuccess
    spaceCenter(id: ID, uid: ID): SpaceCenter
  }
`;
// spaceCenters: [SpaceCenter]
module.exports.SpaceCenterResolvers = {
    SpaceCenter: {
        planet: async (spaceCenter, args, { models }) => {
            return models.Planet.findById({ code: spaceCenter.planet_code });
        },
    },
    SpaceCenterSuccess: {
        pagination: async (spaceCenterPagination, args, { models }) => {
            console.log('spaceCenterPagination', spaceCenterPagination)
            return spaceCenterPagination.pagination;
        },
        nodes: async (spaceCenterNode, args, { models }) => {
            return spaceCenterNode.nodes;
        },
    },
    Query: {
        // SpaceCenters: combineResolvers(isAuthorized, async (root, args, { models }) => {
        //     return models.SpaceCenter.findAll();
        // }),
        spaceCenters: combineResolvers(isAuthorized, async (root, { page, pageSize }, { models }) => {
            try {
                if (page < 1) {
                    throw new UserInputError('The page value you entered is incorrect. (min: 1)');
                }
                if (pageSize > 100 || pageSize < 1) {
                    throw new UserInputError('The pageSize value you entered is incorrect.(min: 1, max: 100)');
                }
                const space_centers = await models.SpaceCenter.findAll();
                const offset = (page - 1) * pageSize;
                const result = {
                    pagination: {
                        total: space_centers.length,
                        page: page,
                        pageSize: pageSize
                    },
                    nodes: space_centers.slice(offset, pageSize + offset)
                }
                return result;
            } catch (err) {
                console.log(err)
                const { extensions } = err;
                if (extensions && extensions.code === 'BAD_USER_INPUT') {
                    throw err;
                } else {
                    const message = err.TypeError ? err.TypeError : 'The request has failed, try again later.'
                    throw new ApolloError(message);
                }
            }
        }),
        spaceCenter: combineResolvers(isAuthorized, async (root, { id, uid }, { loaders }) => {
            if (id) {
                const space_center = await loaders.getSpaceCenterByID.load(id);
                return space_center[0];
            }
            if (uid) {
                const space_center = await loaders.getSpaceCenterByUID.load(uid);
                return space_center[0];
            }
        })
    },
};


