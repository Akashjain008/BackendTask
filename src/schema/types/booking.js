const { gql, UserInputError, ApolloError } = require('apollo-server-koa');
// import { GraphQLDateTime } from 'graphql-iso-date';
// import { UserInputError } from 'apollo-server-koa';
const { isAuthorized } = require('../../middleware');
const { combineResolvers } = require("graphql-resolvers");

module.exports.Booking = gql`
  type Booking {
    id: ID
    flight: Flight 
    seatCount: Int
    email: String
  }

  input bookingInfo {
    seatCount: Int!
    flightId: String!
    email: String!
  }

  type pagination {
    total: Int
    page: Int
    pageSize: Int
  }

  type BookingSuccess {
    pagination: pagination
    nodes: [Booking]
  }

  type Query {
    bookings(email: String!, page: Int = 1, pageSize: Int = 10): BookingSuccess
    booking(id: ID!): Booking
  }
  
  type Mutation {
    bookFlight(bookingInfo: bookingInfo!): Booking
  }
`;

module.exports.BookingResolvers = {
    Booking: {
        flight: async (booking, args, { models }) => {
            console.log('planet', booking);
            const flight = await models.Flight.findById({ code: booking.flightId });
            return flight[0];
        },
    },
    Query: {
        bookings: combineResolvers(isAuthorized, async (root, { email, page, pageSize }, { models }) => {
            try {
                if (page < 1) {
                    throw new UserInputError('The page value you entered is incorrect. (min: 1)');
                }
                if (pageSize > 100 || pageSize < 1) {
                    throw new UserInputError('The pageSize value you entered is incorrect.(min: 1, max: 100)');
                }
                const bookings = await models.Booking.findById({ email });
                const offset = (page - 1) * pageSize;
                const result = {
                    pagination: {
                        total: bookings.length,
                        page: page,
                        pageSize: pageSize
                    },
                    nodes: bookings.slice(offset, pageSize + offset)
                }
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
            // const data = await models.Planet.findAll();

        }),
        booking: combineResolvers(isAuthorized, async (root, { id }, { models }) => {
            const booking = await models.Booking.findById({ id: id });
            return booking[0];
        })
    },
    Mutation: {
        bookFlight: combineResolvers(isAuthorized, async (root, { bookingInfo }, { models }) => {
            try {
                const seatCount = bookingInfo.seatCount;
                const email = bookingInfo.email;
                const flightId = bookingInfo.flightId;
                const flightDetails = await models.Flight.findById({ code: flightId });
                if (!flightDetails) {
                    throw new UserInputError('The flight Id you entered is incorrect.');
                    // return {
                    //     __typename: 'BookingError',
                    //     message: 'The flight Id you entered is incorrect.',
                    //     code: 'BAD_USER_INPUT'
                    // }
                }
                const availableSeats = flightDetails.availableSeats - seatCount;
                if (availableSeats < 0) {
                    throw new UserInputError('Unfortunately, there are no seats left on this flight.');
                    // return {
                    //     __typename: 'BookingError',
                    //     message: 'Unfortunately, there are no seats left on this flight.',
                    //     code: 'BAD_USER_INPUT'
                    // }
                }
                const booking = await models.Booking.create({
                    seatCount,
                    email,
                    flightId
                });
                await models.Flight.update({ code: flightId }, { availableSeats: availableSeats });
                return booking[0];
                // return {
                //     __typename: "Booking",
                //     ...booking[0]
                // }
            } catch (err) {
                // console.log('err', err.TypeError);
                // const message = err.TypeError ? err.TypeError : 'The request has failed, try again later.'
                // return {
                //     __typename: 'BookingError',
                //     message: `${message}`,
                //     code: 'INTERNAL_SERVER_ERROR'
                // }
                const { extensions } = err;
                if (extensions && extensions.code === 'BAD_USER_INPUT') {
                    throw err;
                } else {
                    const message = err.TypeError ? err.TypeError : 'The request has failed, try again later.'
                    throw new ApolloError(message);
                }

            }

        })
    }
};


