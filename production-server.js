const express = require('express');
const path = require('path');

const app = express();
const port = Number(process.env.PORT) || 3000;
const buildDirectory = path.join(__dirname, 'build');

app.disable('x-powered-by');

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use(
  express.static(buildDirectory, {
    maxAge: '1y',
    immutable: true,
    setHeaders(response, filePath) {
      if (filePath.endsWith('index.html')) {
        response.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

app.get('*', (_request, response) => {
  response.sendFile(path.join(buildDirectory, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Church website listening on port ${port}`);
});
