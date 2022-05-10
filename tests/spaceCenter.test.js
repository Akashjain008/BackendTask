require('cross-fetch/polyfill');
const { ApolloClient, gql } = require('apollo-boost');
const { getClient } = require('./utils/getClient');
const AUTHORIZATION_KEY = process.env.AUTHORIZATION_KEY;
const clientWithAuth = getClient(AUTHORIZATION_KEY);
const clientWithOutAuth = getClient();

beforeAll(async () => {
})

describe('Test the space center query', () => {
    it('should not execute space center query without authorization', async () => {
        const getSpaceCenter = gql`
        query SpaceCenters {
            spaceCenters(page: 1, pageSize: 2) {
              pagination {
                total
                page
                pageSize
              }
              nodes {
                name
                uid
              }
            }
          }
     `;
        await expect(clientWithOutAuth.query({
            query: getSpaceCenter
        })).rejects.toThrowError("Not Authorized");
    })

    it('should execute space center query with authorization', async () => {
        const getSpaceCenter = gql`
        query SpaceCenters {
            spaceCenters(page: 1, pageSize: 2) {
              pagination {
                total
                page
                pageSize
              }
              nodes {
                name
                uid
              }
            }
          }
     `;
        const queryRes = await clientWithAuth.query({
            query: getSpaceCenter
        });
        console.log('queryRes', queryRes);
        await expect(queryRes.data.spaceCenters.nodes.length).toBe(2);
    })
});