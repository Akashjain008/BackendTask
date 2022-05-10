require('cross-fetch/polyfill');
const { ApolloClient, gql } = require('apollo-boost');
const { getClient } = require('./utils/getClient');
const AUTHORIZATION_KEY = process.env.AUTHORIZATION_KEY;
const clientWithAuth = getClient(AUTHORIZATION_KEY);
const clientWithOutAuth = getClient();

beforeAll(async () => {
})

describe('Test the Space Center Mutation', () => {
    it('should not execute mutation without authorization', async () => {
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

    it('should execute planets query with authorization', async () => {
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
        await expect(mutationRes.data.scheduleFlight).toBe(1);
    })
});