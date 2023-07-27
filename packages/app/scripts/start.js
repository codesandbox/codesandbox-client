/* eslint-disable */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var cors = require('cors');
var chalk = require('chalk');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var historyApiFallback = require('connect-history-api-fallback');
var execSync = require('child_process').execSync;
var opn = require('opn');
var http = require('http');
var { createProxyMiddleware } = require('http-proxy-middleware');
var path = require('path');
var httpProxy = require('http-proxy');
const { platform } = require('os');
var config = require('../config/webpack.dev');
var paths = require('../config/paths');
const { staticAssets } = require('../config/build');

// Tools like Cloud9 rely on this.
var DEFAULT_PORT = process.env.PORT || 3000;
const PROXY_DOMAIN = process.env.ENDPOINT || 'https://codesandbox.io';
var compiler;
var handleCompile;
var compileStart;
var shouldClearConsole =
  'CLEAR' in process.env
    ? ['1', 'true'].includes(process.env.CLEAR)
    : platform() !== 'win32';

// Some custom utilities to prettify Webpack output.
// This is a little hacky.
// It would be easier if webpack provided a rich error object.
var friendlySyntaxErrorLabel = 'Syntax error:';
function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}
function formatMessage(message) {
  return (
    message
      // Make some common errors shorter:
      .replace(
        // Babel syntax error
        'Module build failed: SyntaxError:',
        friendlySyntaxErrorLabel
      )
      .replace(
        // Webpack file not found error
        /Module not found: Error: Cannot resolve 'file' or 'directory'/,
        'Module not found:'
      )
      // Internal stacks are generally useless so we strip them
      .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y
      // Webpack loader names obscure CSS filenames
      .replace('./~/css-loader!./~/postcss-loader!', '')
  );
}

function clearConsole() {
  // This seems to work best on Windows and other systems.
  // The intention is to clear the output so you can focus on most recent build.
  if (shouldClearConsole) {
    process.stdout.write('\x1bc');
  }
}

function setupCompiler(port, protocol) {
  // "Compiler" is a low-level interface to Webpack.
  // It lets us listen to some events and provide our own custom messages.
  try {
    compiler = webpack(config, handleCompile);
  } catch (err) {
    console.log(chalk.red('Failed to compile.\n'));
    console.log(`${err.message || err}\n`);
    process.exit(1);
  }

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.hooks.invalid.tap('invalid', function (module) {
    clearConsole();
    compileStart = Date.now();
    console.log(`Module ${chalk.yellow(module)} updated, re-compiling...`);
  });

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.hooks.done.tap('done', stats => {
    clearConsole();
    const took = new Date() - compileStart;

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    // We use stats.toJson({}, true) to make output more compact and readable:
    // https://github.com/facebookincubator/create-react-app/issues/401#issuecomment-238291901
    if (stats.hasErrors()) {
      console.log(chalk.red(`Failed to compile after ${took / 1000}s.\n`));
      var json = stats.toJson({}, true);
      var formattedErrors = json.errors.map(
        message => 'Error in ' + formatMessage(message)
      );
      if (formattedErrors.some(isLikelyASyntaxError)) {
        // If there are any syntax errors, show just them.
        // This prevents a confusing ESLint parsing error
        // preceding a much more useful Babel syntax error.
        formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
      }
      formattedErrors.forEach(message => {
        console.log(`${message}\n`);
      });
      // If errors exist, ignore warnings.
      return;
    }

    // filter known warnings:
    // CriticalDependencyWarning: Critical dependency: the request of a dependency is an expression
    //   in ./node_modules/typescript/lib/typescript.js
    // CriticalDependencyWarning: Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
    //   in ./packages/app/node_modules/babel-plugin-macros/dist/index.js
    // CriticalDependencyWarning: Critical dependency: the request of a dependency is an expression
    //   in ./packages/app/node_modules/cosmiconfig/dist/loaders.js
    // CriticalDependencyWarning: Critical dependency: the request of a dependency is an expression
    //   in ./packages/app/src/app/components/CodeEditor/CodeMirror/index.js
    const warnings = stats.compilation.warnings
      .concat(...stats.compilation.children.map(child => child.warnings))
      .filter(warning => warning.error.name !== 'CriticalDependencyWarning')
      // ignore "Error: Can't resolve 'sugarss' in '/client/node_modules/postcss-import/lib'" warning
      .filter(
        warning =>
          !warning.module.resource.endsWith(
            'node_modules/postcss-import/lib/process-content.js'
          )
      );
    const hasWarnings = warnings.length > 0;
    if (hasWarnings) {
      console.log(chalk.yellow(`Compiled with warnings in ${took / 1000}s.\n`));
      warnings.forEach(({ error, module }) => {
        console.log(
          `${error.name}: ${error.message}\n  in ${module.resource}\n`
        );
      });
      // Teach some ESLint tricks.
      console.log('You may use special comments to disable some warnings.');
      console.log(
        'Use ' +
          chalk.yellow('// eslint-disable-next-line') +
          ' to ignore the next line.'
      );
      console.log(
        'Use ' +
          chalk.yellow('/* eslint-disable */') +
          ' to ignore all warnings in a file.\n'
      );
    }

    if (!hasWarnings) {
      console.log(chalk.green(`Compiled successfully in ${took / 1000}s!\n`));
    }

    console.log('The app is running at:\n');
    console.log(`  ${chalk.cyan(`${protocol}://localhost:${port}/`)}\n`);
    console.log('Note that the development build is not optimized.');
    console.log(
      `To create a production build, use ${chalk.cyan('yarn build')}.\n`
    );
  });
}

function openBrowser(port, protocol) {
  const url = protocol + '://localhost:' + port + '/s';
  if (process.platform === 'darwin') {
    try {
      // Try our best to reuse existing tab
      // on OS X Google Chrome with AppleScript
      execSync('ps cax | grep "Google Chrome"');
      execSync('osascript chrome.applescript ' + url, {
        cwd: path.join(__dirname, 'utils'),
        stdio: 'ignore',
      });
      return;
    } catch (err) {
      // Ignore errors.
    }
  }
  // Fallback to opn
  // (It will always open new tab)
  opn(url);
}

function addMiddleware(devServer, index) {
  devServer.use(function (req, res, next) {
    if (req.url === '/') {
      req.url = '/homepage';
    }
    next();
  });
  devServer.use('/homepage', express.static(paths.homepageSrc));

  const rootPath = path.resolve(__dirname, '../../..');
  staticAssets.forEach(({ from, to }) => {
    const fromPath = path.resolve(rootPath, from);
    devServer.use(`/${to}`, express.static(fromPath));
  });

  devServer.use(
    historyApiFallback({
      // Allow paths with dots in them to be loaded, reference issue #387
      disableDotRule: true,
      // For single page apps, we generally want to fallback to /index.html.
      // However we also want to respect `proxy` for API calls.
      // So if `proxy` is specified, we need to decide which fallback to use.
      // We use a heuristic: if request `accept`s text/html, we pick /index.html.
      // Modern browsers include text/html into `accept` header when navigating.
      // However API calls like `fetch()` won’t generally won’t accept text/html.
      // If this heuristic doesn’t work well for you, don’t use `proxy`.
      htmlAcceptHeaders: ['text/html'],
      index,
      rewrites: [{ from: /\/embed/, to: '/embed.html' }],
    })
  );
  let wsProxy;
  if (process.env.LOCAL_SERVER) {
    devServer.use(
      cors({
        origin: true,
        credentials: true,
      })
    );
    wsProxy = createProxyMiddleware({
      target: PROXY_DOMAIN.replace('https', 'wss'),
      changeOrigin: true,
      ws: true,
      autoRewrite: true,
      headers: { Connection: 'keep-alive' },
      protocolRewrite: true,
      onProxyReqWs(proxyReq, req, socket, options, head) {
        proxyReq.setHeader('Origin', PROXY_DOMAIN);
      },
    });
    devServer.use('/socket', wsProxy);
    devServer.use(
      '/api',
      createProxyMiddleware({
        target: PROXY_DOMAIN,
        changeOrigin: true,
      })
    );
    devServer.use(
      '/auth/workos',
      createProxyMiddleware({
        target: PROXY_DOMAIN,
        changeOrigin: true,
      })
    );
  }
  if (process.env.VSCODE) {
    devServer.use(
      ['/vscode**', '/node_modules**', '/monaco**'],
      createProxyMiddleware({
        target: 'http://localhost:8080',
        changeOrigin: true,
      })
    );
  }
  // Finally, by now we have certainly resolved the URL.
  // It may be /index.html, so let the dev server try serving it again.
  devServer.use(devServer.middleware);

  return { wsProxy };
}

function runDevServer(port, protocol, index) {
  var devServerConfig = {
    // It is important to tell WebpackDevServer to use the same "root" path
    // as we specified in the config. In development, we always serve from /.
    publicPath: config.output.publicPath,
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
    quiet: true,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/,
    },
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: protocol === 'https',
    // contentBase: paths.staticPath,
    // public: 'localhost:3000',
    host: process.env.LOCAL_SERVER
      ? 'localhost'
      : process.env.DEV_DOMAIN || 'codesandbox.test',
    disableHostCheck:
      Boolean(process.env.CSB) ||
      !(process.env.LOCAL_SERVER || process.env.CODESANDBOX_HOST),
    contentBase: false,
    clientLogLevel: 'warning',
    overlay: true,
    inline: true,
    hot: true,
    liveReload: process.env['DISABLE_REFRESH'] ? false : true,
  };
  // console.log(JSON.stringify(devServerConfig, null, 2));
  var devServer = new WebpackDevServer(compiler, devServerConfig);

  // Our custom middleware proxies requests to /index.html or a remote API.
  const { wsProxy } = addMiddleware(devServer, index);

  // Launch WebpackDevServer.
  devServer.listen(port, err => {
    if (err) {
      return console.log(err);
    }

    clearConsole();
    console.log(chalk.cyan('Starting the development server...'));
    openBrowser(port, protocol);
  });

  if (wsProxy) {
    devServer.listeningApp.on('upgrade', wsProxy.upgrade);
  }
}

function run(port) {
  var protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  setupCompiler(port, protocol);
  compileStart = Date.now();
  runDevServer(port, protocol, '/app.html');

  if (process.env.LOCAL_SERVER) {
    // Sandbox server
    const proxy = httpProxy.createProxyServer({
      headers: { Connection: 'keep-alive' },
    });
    proxy.on('error', error => {
      console.error('Got an error', error);
    });
    http
      .createServer(function (req, res) {
        if (req.url === '/' || req.url.endsWith('.html')) {
          proxy.web(req, res, {
            target: 'http://localhost:3000/frame.html',
            ignorePath: true,
          });
        } else {
          proxy.web(req, res, { target: 'http://localhost:3000', ws: true });
        }
      })
      .listen(3002);
  }
}

run(DEFAULT_PORT);
