import { renderGraphiQL } from '@graphql-yoga/render-graphiql';
import { createYoga } from 'graphql-yoga';
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
  console.info('Server ready on port 4000');
});
