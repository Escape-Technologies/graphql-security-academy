import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { renderGraphiQL } from '@graphql-yoga/render-graphiql';
import bodyParser from 'body-parser';
import express from 'express';
import { getContext } from './context.js';
import * as resolvers from './resolvers.js';

const server = new ApolloServer({
  typeDefs: /* GraphQL */ `
    type User {
      id: ID!
      name: String!
      location: String!
    }

    type Query {
      users: [User!]!
      me: User
    }
  `,
  resolvers,
});

await server.start();

const app = express();
app.get('/', (req, res) => {
  res.redirect('/graphql');
});
app.get('/graphql', (req, res) => {
  res.send(
    renderGraphiQL({
      defaultQuery: 'query {\n\tusers {\n\t\tname\n\t\tlocation\n\t}\n}',
      headers: JSON.stringify({ Authorization: 'Bearer 3' }, undefined, 2),
    }),
  );
});
app.post(
  '/graphql',
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => getContext(req),
  }),
);

app.listen(4000, () => {
  console.info('Server ready on port 4000');
});
