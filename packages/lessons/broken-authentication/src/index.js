import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { renderGraphiQL } from '@graphql-yoga/render-graphiql';
import argon2 from 'argon2-browser';
import bodyParser from 'body-parser';
import express from 'express';

/** A mock database table of users. */
const users = [
  {
    name: 'alice',
    password:
      '$argon2d$v=19$m=1024,t=1,p=1$T0lOVENSSENPSTxI$jTAGsml0jkSgZF4mIKF8zZuUW1+CW3X9uZxWj1y8KRQ',
  },
];

const typeDefs = /* GraphQL */ `
  type Query {
    users: [User!]!
  }

  type Mutation {
    login(name: String!, password: String!): String
  }

  type User {
    name: String!
  }
`;

const resolvers = {
  Query: {
    users: () => users,
  },
  Mutation: {
    login: async (_, args) => {
      try {
        const user = users.find((user) => user.name === args.name);
        if (!user) throw new Error('No user found');
        // argon2.verify() throws on invalid password
        await argon2.verify({ encoded: user.password, pass: args.password });
        return 'Login successful!';
      } catch {
        return null;
      }
    },
  },
  User: {
    name: (user) => user.name,
  },
};

const server = new ApolloServer({
  typeDefs,
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
      defaultQuery: 'query {\n\tusers {\n\t\tname\n\t}\n}',
    }),
  );
});
app.post('/graphql', bodyParser.json(), expressMiddleware(server));

app.listen(4000, () => {
  console.info('Server ready on port 4000');
});
