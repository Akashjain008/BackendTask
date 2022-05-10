require('cross-fetch/polyfill');
const { ApolloClient, gql } = require('apollo-boost');
const { getClient } = require('./utils/getClient');
const AUTHORIZATION_KEY = process.env.AUTHORIZATION_KEY;
const clientWithAuth = getClient(AUTHORIZATION_KEY);
const clientWithOutAuth = getClient();

beforeAll(async () => {
})

describe('Test the Flight Query', () => {
  it('should not execute flight query without authorization', async () => {
    const getFlights = gql`
    query Flights {
      flights(flightInfo: { from: "7c17eec7-6b8c-4683-b556-a997bd2eff65",  to: "a283632c-c701-4827-9375-ae6fb3445ca9", departureDay: "2022-05-07", seatCount: 120, page: 1, pageSize: 5}) {
        pagination {
          total
          page
          pageSize
        }
        nodes {
          code
          id
          availableSeats
          seatCount
        }
      }
    }
     `;
    await expect(clientWithOutAuth.query({
      query: getFlights
    })).rejects.toThrowError("Not Authorized");
  })
  
  it('should execute flight query with authorization', async () => {
    const getFlights = gql`
    query Flights {
      flights(flightInfo: { from: "17c17eec7-6b8c-4683-b556-a997bd2eff65",  to: "a283632c-c701-4827-9375-ae6fb3445ca9", departureDay: "2022-05-07", seatCount: 120, page: 1, pageSize: 5}) {
        pagination {
          total
          page
          pageSize
        }
        nodes {
          code
          id
          availableSeats
          seatCount
        }
      }
    }
     `;
    await expect(clientWithAuth.query({
      query: getFlights
    })).rejects.toThrowError("Flight data is not available for this input");
  })
});

describe('Test the Flight Mutation', () => {
  it('should not execute flight mutation without authorization', async () => {
      const postScheduleFlight = gql`
          mutation ScheduleFlight {
              scheduleFlight(flightInfo: {launchSiteId: "7c17eec7-6b8c-4683-b556-a997bd2eff65",landingSiteId: "a283632c-c701-4827-9375-ae6fb3445ca9", departureAt: "2022-05-07", seatCount: 200}) {
                  code
                  seatCount
                  availableSeats
                  id
              }
          }
   `;
      await expect(clientWithOutAuth.mutate({
          mutation: postScheduleFlight
      })).rejects.toThrowError("Not Authorized");
  })

  it('should execute flight mutation with authorization', async () => {
      const postScheduleFlight = gql`
      mutation ScheduleFlight {
          scheduleFlight(flightInfo: {launchSiteId: "7c17eec7-6b8c-4683-b556-a997bd2eff65",landingSiteId: "a283632c-c701-4827-9375-ae6fb3445ca9", departureAt: "2022-05-07", seatCount: 200}) {
              code
              seatCount
              availableSeats
              id
          }
      }
      `;
      const mutationRes = await clientWithAuth.mutate({
          mutation: postScheduleFlight
      });
      console.log('mutationRes', mutationRes);
      const expected = { "seatCount": 200 };
      await expect(mutationRes.data.scheduleFlight).toMatchObject(expected);
  })
});