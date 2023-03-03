import { createSchema } from 'graphql-yoga';
import { getFriends, getUser, User } from './users.js';

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
      user: (_, { id }): User => getUser(id),
    },
    User: {
      id: (user: User) => user.id,
      name: (user: User) => user.name,
      friends: (user: User) => getFriends(user.id),
    },
  },
});
