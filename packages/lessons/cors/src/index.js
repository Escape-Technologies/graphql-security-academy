import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { server } from './server.js';

await server.start();

const app = express();

app.get('/', (req, res) => {
  res.sendFile(fileURLToPath(new URL('index.html', import.meta.url)));
});
app.post('/graphql', cors(), bodyParser.json(), expressMiddleware(server));

app.listen(4000, () => {
  console.info('Server ready on port 4000');
});
