const ApolloClient = require('apollo-boost').default;

module.exports.getClient = (token) => {
    return new ApolloClient({
        uri: 'http://localhost:3000/graphql',
        request: (operation) => {
            if (token) {
                operation.setContext({
                    headers: {
                        "Authorization": `${token}`
                    }
                })
            }
        },
        onError: ({ networkError, graphQLErrors }) => {
            console.log('graphQLErrors', graphQLErrors)
            console.log('networkError', networkError)
        }
    });
}