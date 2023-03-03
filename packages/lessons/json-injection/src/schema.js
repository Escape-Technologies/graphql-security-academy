import { PrismaClient } from '@prisma/client';
import { createSchema } from 'graphql-yoga';
import { JSONDefinition, JSONResolver } from 'graphql-scalars';

const prisma = new PrismaClient();

export const schema = createSchema({
  typeDefs: [
    /* GraphQL */ `
      type Query {
        findUsers(where: JSON = {}): [User]
      }

      type User {
        id: ID!
        firstName: String
        lastName: String
        email: String
      }
    `,
    JSONDefinition,
  ],
  resolvers: {
    JSON: JSONResolver,
    Query: {
      findUsers: (_, { where }) => prisma.user.findMany({ where }),
    },
    User: {
      id: (user) => user.id,
      firstName: (user) => user.firstName,
      lastName: (user) => user.lastName,
      email: (user) => user.email,
    },
  },
});
