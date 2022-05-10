#!/usr/bin/env node

'use strict';

const config = require('./config');
const { App } = require('./app');
const logger = require('./logger');

const { ApolloServer } = require('apollo-server-koa');
const schema = require('./schema/index');
const models = require('../src/db/models');
const { formatError } = require('./middlewares/error-handler');
const loaders = require('../src/db/dataloader');

const app = new App();

function handleError(err, ctx) {
    if (ctx == null) {
        logger.error({ err, event: 'error' }, 'Unhandled exception occured');
    }
}

async function terminate(signal) {
    try {
        await app.terminate();
    } finally {
        logger.info({ signal, event: 'terminate' }, 'App is terminated');
        process.kill(process.pid, signal);
    }
}

// Handle uncaught errors
app.on('error', handleError);

const apolloServer = new ApolloServer({
    schema,
    csrfPrevention: true,
    context: ({ ctx }) => ({
        authorization: ctx.headers.authorization || "",
        models,
        loaders: loaders()
    }),
    introspection: true,
    playground: true,
    formatError: (err) => {
        return formatError(err);
    }
});

apolloServer.start().then((resp) => {
    apolloServer.applyMiddleware({ app });
    const server = app.listen(config.port, config.host, () => {
        console.log({ event: 'execute' }, `API server listening on ${config.host}:${config.port}:${apolloServer.graphqlPath}, in ${config.env}`);
    });

    server.on('error', handleError);

    const errors = ['unhandledRejection', 'uncaughtException'];
    errors.map(error => {
        process.on(error, handleError);
    });

    const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    signals.map(signal => {
        process.once(signal, () => terminate(signal));
    });
})
.catch((error) => {
    handleError(error);
})


// Expose app
module.exports = app;
