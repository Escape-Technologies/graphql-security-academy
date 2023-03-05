import { createSchema } from 'graphql-yoga';

const users = [{ name: 'Alice' }, { name: 'Bob' }];

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      users: [User]
    }
    type Mutation {
      createUser(name: String!): User
    }
    type User {
      id: ID
      name: String
    }
  `,
  resolvers: {
    Query: {
      users: () => users.map((user, id) => ({ id, ...user })),
    },
    Mutation: {
      createUser: (_, { name }) => {
        const user = { name };
        users.push(user);
        const id = users.indexOf(user);
        return { id, ...user };
      },
    },
    User: {
      id: (user) => user.id,
      name: (user) => user.name,
    },
  },
});
