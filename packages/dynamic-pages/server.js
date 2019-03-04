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
    server.use('/static', express.static('.next'));
    server.get('/profile/:username', (req, res) => {
      app.render(req, res, '/profile', { username: req.params.username });
    });

    server.get('/profile/:username/:page', (req, res) => {
      app.render(req, res, '/user-sandboxes', {
        username: req.params.username,
        page: req.params.page,
      });
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(8080, err => {
      if (err) throw err;
      // eslint-disable-next-line
      console.log('> Ready on http://localhost:8080');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
