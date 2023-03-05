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
        user(id: 1) {
          id
          name
        }
      }
    `,
  },
  plugins: [
    // Add plugins here!
  ],
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info('Server ready on port 4000');
});
