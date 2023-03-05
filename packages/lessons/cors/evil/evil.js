import express from 'express';
import { fileURLToPath } from 'node:url';

const app = express();
app.get('/', (req, res) => {
  res.sendFile(fileURLToPath(new URL('evil.html', import.meta.url)));
});

app.listen(5000);
