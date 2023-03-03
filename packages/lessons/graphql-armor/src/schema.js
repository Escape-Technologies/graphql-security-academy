import { createSchema } from 'graphql-yoga';
import { getFriends, getUser } from './users.js';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      user(id: ID!): User
    }

    type User {
      id: ID!
      name: String
      friends: [User]
    }
  `,
  resolvers: {
    Query: {
      user: (_, { id }) => getUser(id),
    },
    User: {
      id: (user) => user.id,
      name: (user) => user.name,
      friends: (user) => getFriends(user.id),
    },
  },
});
