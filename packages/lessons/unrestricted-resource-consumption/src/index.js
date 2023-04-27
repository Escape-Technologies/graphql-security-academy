import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { renderGraphiQL } from '@graphql-yoga/render-graphiql';
import bodyParser from 'body-parser';
import express from 'express';

/** A mock database table of users. */
const users = [
  { name: 'Alice', friends: [1, 3, 4] },
  { name: 'Bob', friends: [0, 2, 3] },
  { name: 'Charlie', friends: [1, 3, 4] },
  { name: 'Dan', friends: [0, 1, 2, 4] },
  { name: 'Eve', friends: [0, 2, 3] },
];

const getUser = (id) => ({ id, name: users[id].name });

const typeDefs = /* GraphQL */ `
  type Query {
    user(id: ID!): User
  }

  type User {
    id: ID!
    name: String
    friends: [User]
  }
`;

const resolvers = {
  Query: {
    user: (_, { id }) => ({ id, name: users[id].name }),
  },
  User: {
    id: (user) => user.id,
    name: (user) => user.name,
    friends: (user) => users[user.id].friends.map(getUser),
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
      defaultQuery:
        'query {\n\tuser(id: 1) {\n\t\tname\n\t\tfriends { name }\n\t}\n}',
    })
  );
});
app.post('/graphql', bodyParser.json(), expressMiddleware(server));

app.listen(4000, () => {
  console.info('Server ready on port 4000');
});
