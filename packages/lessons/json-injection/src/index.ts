import { createYoga } from 'graphql-yoga';
import { renderGraphiQL } from '@graphql-yoga/render-graphiql';
import { createServer } from 'node:http';
import { schema } from './schema.js';

const yoga = createYoga({
  schema,
  renderGraphiQL,
  graphiql: {
    defaultQuery: /* GraphQL */ `
      query {
        findUsers(where: { email: { endsWith: "@example.com" } }) {
          firstName
          lastName
          email
        }
      }
    `,
  },
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
