import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { renderGraphiQL } from '@graphql-yoga/render-graphiql';
import bodyParser from 'body-parser';
import express from 'express';

/** A lessons database. */
const lessons = [
  {
    title: 'Disable Debug Mode',
    points: 10,
  },
  {
    title: 'JSON Injection',
    // Oh no, points is undefined!
    points: undefined,
  },
];

const server = new ApolloServer({
  typeDefs: /* GraphQL */ `
    type Lesson {
      title: String!
      points: Int!
    }

    type Query {
      lessons: [Lesson!]!
    }
  `,
  resolvers: {
    Query: {
      lessons: () => lessons,
    },
  },
  introspection: true,
});

await server.start();

const app = express();
app.get('/', (req, res) => {
  res.redirect('/graphql');
});
app.get('/graphql', (req, res) => {
  res.send(
    renderGraphiQL({ defaultQuery: 'query {\n\tlessons {\n\t\ttitle\n\t}\n}' }),
  );
});
app.post('/graphql', bodyParser.json(), expressMiddleware(server));

app.listen(4000, () => {
  console.info('Server ready on port 4000');
});
