import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { renderGraphiQL } from '@graphql-yoga/render-graphiql';
import bodyParser from 'body-parser';
import express from 'express';
import * as resolvers from './resolvers.js';

const server = new ApolloServer({
  typeDefs: /* GraphQL */ `
    type User {
      id: ID!
      email: String!
      admin: Boolean!
    }

    type Query {
      users: [User!]!
    }

    type Mutation {
      login(email: String!, password: String!): User!
      register(email: String!, password: String!): Boolean!
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
    renderGraphiQL({ defaultQuery: 'query {\n\tusers {\n\t\temail\n\t}\n}' })
  );
});
app.post('/graphql', bodyParser.json(), expressMiddleware(server));

app.listen(4000, () => {
  console.info('Server ready on port 4000');
});
