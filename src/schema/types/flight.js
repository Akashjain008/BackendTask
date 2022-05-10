const { gql, ApolloError, UserInputError } = require('apollo-server-koa');
const crypto = require("crypto");
const { isAuthorized } = require('../../middleware');
const { combineResolvers } = require("graphql-resolvers");

module.exports.Flight = gql`
  scalar Date
  type Flight {
    id: ID
    code: String 
    launchSite: SpaceCenter
    landingSite: SpaceCenter
    departureAt: Date
    seatCount: Int
    availableSeats: Int
  }

  input flightInput {
      from: String!
      to: String!
      seatCount: Int!
      departureDay: Date!
      page: Int = 1
      pageSize: Int = 10
  }

  type pagination {
    total: Int
    page: Int
    pageSize: Int
  }

  type FlightSuccess {
    pagination: pagination
    nodes: [Flight]
  }

  type Query {
    flights(flightInfo: flightInput!): FlightSuccess
    flight(id: ID!): Flight
  }

  input ScheduleFlightInput {
    launchSiteId: String!
    landingSiteId: String!
    departureAt: Date!
    seatCount: Int!
  }

  type Mutation {
    scheduleFlight(flightInfo: ScheduleFlightInput!): Flight
  }
`;

module.exports.FlightResolvers = {
    Flight: {
        launchSite: async (flight, args, { models }) => {
            const launch_site = await models.SpaceCenter.findById({ uid: flight.launchSite });
            return launch_site[0];
        },
        landingSite: async (flight, args, { models }) => {
            const landing_site = await models.SpaceCenter.findById({ uid: flight.landingSite });
            return landing_site[0];
        }
    },
    Query: {
        flights: combineResolvers(isAuthorized, async (root, { flightInfo }, { models }) => {
            try {
                const { from, to, departureDay, seatCount, page, pageSize } = flightInfo;
                if (page < 1) {
                    throw new UserInputError('The page value you entered is incorrect. (min: 1)');
                }
                if (pageSize > 100 || pageSize < 1) {
                    throw new UserInputError('The pageSize value you entered is incorrect.(min: 1, max: 100)');
                }
                const query = {
                    launchSite: from,
                    landingSite: to,
                    departureAt: departureDay,
                    seatCount: seatCount
                };
                const flights = await models.Flight.customFindAll(query);
                if (flights && flights.length === 0) {
                    throw new UserInputError('Flight data is not available for this input request.');
                }
                const offset = (page - 1) * pageSize;
                const result = {
                    pagination: {
                        total: flights.length,
                        page: page,
                        pageSize: pageSize
                    },
                    nodes: flights.slice(offset, pageSize + offset)
                }
                console.log(result);
                return result;
            } catch (error) {
                const { extensions } = error;
                if (extensions && extensions.code === 'BAD_USER_INPUT') {
                    throw error;
                } else {
                    const message = error.TypeError ? error.TypeError : 'The request has failed, try again later.'
                    throw new ApolloError(message);
                }
            }
        }),
        flight: combineResolvers(isAuthorized, async (root, { id }, { models }) => {
            const flight = await models.Flight.findById({ id });
            return flight[0];
        })
    },
    Mutation: {
        scheduleFlight: combineResolvers(isAuthorized, async (root, { flightInfo }, { models }) => {
            try {
                const code = crypto.randomBytes(16).toString("hex");
                const launchSite = flightInfo.launchSiteId;
                const landingSite = flightInfo.landingSiteId;
                const departureAt = flightInfo.departureAt;
                const seatCount = flightInfo.seatCount;
                const availableSeats = flightInfo.seatCount;
                const flight = await models.Flight.create({
                    code,
                    launchSite,
                    landingSite,
                    departureAt,
                    seatCount,
                    availableSeats
                });
                console.log('flight', flight);
                return flight[0];
                // return {
                //     __typename: "Flight",
                //     ...flight[0]
                // }
            } catch (err) {
                const { extensions } = err;
                if (extensions && extensions.code === 'BAD_USER_INPUT') {
                    throw err;
                } else {
                    const message = err.TypeError ? err.TypeError : 'The request has failed, try again later.'
                    throw new ApolloError(message);
                }

                // return {
                //     __typename: 'FlightError',
                //     message: `${message}`,
                //     code: 'INTERNAL_SERVER_ERROR'
                // }

            }

        })
    }
};


