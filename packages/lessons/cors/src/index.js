import { createYoga } from 'graphql-yoga';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { schema } from './schema.js';

const app = express();
const yoga = createYoga({
  schema,
  graphiql: false,
});

app.get('/', (req, res) => {
  res.sendFile(fileURLToPath(new URL('index.html', import.meta.url)));
});
app.all('/graphql', yoga);

app.listen(4000, () => {
  console.info('Server ready on port 4000');
});
