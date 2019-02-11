const express = require('express');
const next = require('next');
const proxy = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(
      '/api',
      proxy({ target: 'https://codesandbox.io', changeOrigin: true })
    );
    server.get('/profile/:username', (req, res) => {
      const actualPage = '/profile';
      const queryParams = { username: req.params.username };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(3000, err => {
      if (err) throw err;
      // eslint-disable-next-line
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
