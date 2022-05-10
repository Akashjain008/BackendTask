require('cross-fetch/polyfill');
const { ApolloClient, gql } = require('apollo-boost');
const { getClient } = require('./utils/getClient');
const AUTHORIZATION_KEY = process.env.AUTHORIZATION_KEY;
const clientWithAuth = getClient(AUTHORIZATION_KEY);
const clientWithOutAuth = getClient();

beforeAll(async () => {
})

describe('Test the planet query', () => {
  it('should not execute query without authorization', async () => {
    const getPlanets = gql`
    query planets {
      planets {
        id
        name
        code
        spaceCenters(limit: 3) {
          id
        }
      }
    }
     `;
    await expect(clientWithOutAuth.query({
      query: getPlanets
    })).rejects.toThrowError("Not Authorized");
  })
  
  it('should execute planets query with authorization', async () => {
    const getPlanets = gql`
    query Query {
      planets(offset: 1, limit: 1) {
        name
        code
        spaceCenters(limit:1) {
          name
        }
      }
    }
     `;
    const queryRes = await clientWithAuth.query({
      query: getPlanets
    });
    console.log('queryRes',queryRes);
    await expect(queryRes.data.planets.length).toBe(1);
  })
});