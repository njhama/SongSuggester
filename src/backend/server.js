const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

// You need to await server.start() before applying middleware.
async function startApolloServer() {
  await server.start();

  // Modify the callback function to log when a client connects.
  server.applyMiddleware({ app }, () => {
    console.log(`Client connected to GraphQL at http://localhost:4000${server.graphqlPath}`);
  });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer().catch((error) => {
  console.error('Error starting Apollo Server:', error);
});
