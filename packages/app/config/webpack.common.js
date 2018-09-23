const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');
const WatchMissingNodeModulesPlugin = require('../scripts/utils/WatchMissingNodeModulesPlugin');
const env = require('./env');
const getHost = require('./host');

const babelDev = require('./babel.dev');
const babelProd = require('./babel.prod');

const NODE_ENV = JSON.parse(env['process.env.NODE_ENV']);
const SANDBOX_ONLY = !!process.env.SANDBOX_ONLY;
const __DEV__ = NODE_ENV === 'development'; // eslint-disable-line no-underscore-dangle
const __PROD__ = NODE_ENV === 'production'; // eslint-disable-line no-underscore-dangle
// const __TEST__ = NODE_ENV === 'test'; // eslint-disable-line no-underscore-dangle
const babelConfig = __DEV__ ? babelDev : babelProd;

const publicPath = SANDBOX_ONLY || __DEV__ ? '/' : getHost() + '/';

// Shim for `eslint-plugin-vue/lib/index.js`
const ESLINT_PLUGIN_VUE_INDEX = `module.exports = {
  rules: {${fs
    .readdirSync(
      path.join(
        __dirname,
        '..',
        '..',
        '..',
        'node_modules',
        'eslint-plugin-vue',
        'lib',
        'rules'
      )
    )
    .filter(filename => path.extname(filename) === '.js')
    .map(filename => {
      const ruleId = path.basename(filename, '.js');
      return `        "${ruleId}": require("eslint-plugin-vue/lib/rules/${filename}"),`;
    })
    .join('\n')}
  },
  processors: {
      ".vue": require("eslint-plugin-vue/lib/processor")
  }
}`;

const sepRe = `\\${path.sep}`; // path separator regex

module.exports = {
  entry: SANDBOX_ONLY
    ? {
        sandbox: [
          '@babel/polyfill',
          require.resolve('./polyfills'),
          path.join(paths.sandboxSrc, 'index.js'),
        ],
        'sandbox-startup': path.join(paths.sandboxSrc, 'startup.js'),
      }
    : {
        app: [
          require.resolve('./polyfills'),
          path.join(paths.appSrc, 'index.js'),
        ],
        sandbox: [
          '@babel/polyfill',
          require.resolve('./polyfills'),
          path.join(paths.sandboxSrc, 'index.js'),
        ],
        'sandbox-startup': path.join(paths.sandboxSrc, 'startup.js'),
        embed: [
          require.resolve('./polyfills'),
          path.join(paths.embedSrc, 'index.js'),
        ],
      },
  target: 'web',
  mode: 'development',

  node: {
    setImmediate: false,
    module: 'empty',
    child_process: 'empty',
  },

  output: {
    path: paths.appBuild,
    publicPath,
    globalObject: 'this',
  },

  module: {
    rules: [
      {
        test: /\.wasm$/,
        loader: 'file-loader',
        type: 'javascript/auto',
      },
      {
        test: /\.js$/,
        include: [paths.src, paths.common, /@emmetio/],
        exclude: [
          /eslint\.4\.1\.0\.min\.js$/,
          /typescriptServices\.js$/,
          new RegExp(`babel-runtime${sepRe}`),
        ],
        loader: 'happypack/loader',
      },

      // Transpile node dependencies, node deps are often not transpiled for IE11
      {
        test: [
          new RegExp(`${sepRe}node_modules${sepRe}.*ansi-styles`),
          new RegExp(`${sepRe}node_modules${sepRe}.*chalk`),
          new RegExp(`${sepRe}node_modules${sepRe}.*jest`),
          new RegExp(`${sepRe}node_modules${sepRe}.*monaco-textmate`),
          new RegExp(`${sepRe}node_modules${sepRe}.*onigasm`),
          new RegExp(`sandbox-hooks`),
          new RegExp(
            `${sepRe}node_modules${sepRe}vue-template-es2015-compiler`
          ),
          new RegExp(
            `${sepRe}node_modules${sepRe}babel-plugin-transform-vue-jsx`
          ),
        ],
        loader: 'babel-loader',
        query: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  ie: '11',
                  esmodules: true,
                },
                modules: 'umd',
              },
            ],
            '@babel/preset-react',
          ],
          plugins: [
            '@babel/plugin-transform-async-to-generator',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-runtime',
          ],
        },
      },

      // `eslint-plugin-vue/lib/index.js` depends on `fs` module we cannot use in browsers, so needs shimming.
      {
        test: new RegExp(`eslint-plugin-vue${sepRe}lib${sepRe}index\\.js$`),
        loader: 'string-replace-loader',
        options: {
          search: '[\\s\\S]+', // whole file.
          replace: ESLINT_PLUGIN_VUE_INDEX,
          flags: 'g',
        },
      },
      // `eslint` has some dynamic `require(...)`.
      // Delete those.
      {
        test: new RegExp(`eslint${sepRe}lib${sepRe}(?:linter|rules)\\.js$`),
        loader: 'string-replace-loader',
        options: {
          search: '(?:\\|\\||(\\())\\s*require\\(.+?\\)',
          replace: '$1',
          flags: 'g',
        },
      },
      // `vue-eslint-parser` has `require(parserOptions.parser || "espree")`.
      // Modify it by a static importing.
      {
        test: /vue-eslint-parser/,
        loader: 'string-replace-loader',
        options: {
          search: 'require(parserOptions.parser || "espree")',
          replace:
            '(parserOptions.parser === "babel-eslint" ? require("babel-eslint") : require("espree"))',
        },
      },
      // Patch for `babel-eslint`
      {
        test: new RegExp(`babel-eslint${sepRe}lib${sepRe}index\\.js$`),
        loader: 'string-replace-loader',
        options: {
          search: '[\\s\\S]+', // whole file.
          replace:
            'module.exports.parseForESLint = require("./parse-with-scope")',
          flags: 'g',
        },
      },
      {
        test: new RegExp(
          `babel-eslint${sepRe}lib${sepRe}patch-eslint-scope\\.js$`
        ),
        loader: 'string-replace-loader',
        options: {
          search: '[\\s\\S]+', // whole file.
          replace: 'module.exports = () => {}',
          flags: 'g',
        },
      },
      // Remove dynamic require in jest circus
      {
        test: /format_node_assert_errors\.js/,
        loader: 'string-replace-loader',
        options: {
          search: `assert = require.call(null, 'assert');`,
          replace: `throw new Error('module assert not found')`,
        },
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
      // For importing README.md
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        exclude: [/\/favicon.ico$/],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // A special case for favicon.ico to place it into build root directory.
      {
        test: /\/favicon.ico$/,
        include: [paths.src],
        loader: 'file-loader',
        options: {
          name: 'favicon.ico?[hash:8]',
        },
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: /\.(mp4|webm)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],

    noParse: [
      /eslint\.4\.1\.0\.min\.js$/,
      /typescriptServices\.js$/,
      /browserfs\.js/,
      /browserfs\.min\.js/,
      /standalone-packages/,
    ],
  },

  // To make jsonlint work
  externals: ['file', 'system'],

  resolve: {
    mainFields: ['browser', 'module', 'jsnext:main', 'main'],
    modules: ['node_modules', 'src', 'standalone-packages'],

    extensions: ['.js', '.json'],

    alias: {
      moment: 'moment/moment.js',

      fs: 'codesandbox-browserfs/dist/shims/fs.js',
      buffer: 'codesandbox-browserfs/dist/shims/buffer.js',
      processGlobal: 'codesandbox-browserfs/dist/shims/process.js',
      bufferGlobal: 'codesandbox-browserfs/dist/shims/bufferGlobal.js',
      bfsGlobal: require.resolve(
        path.join(
          '..',
          '..',
          '..',
          'standalone-packages',
          'codesandbox-browserfs',
          'build',
          __DEV__ ? 'browserfs.js' : 'browserfs.min.js'
        )
      ),
    },
  },

  plugins: [
    new HappyPack({
      loaders: [
        {
          path: 'babel-loader',
          query: babelConfig,
        },
      ],
    }),
    ...(SANDBOX_ONLY
      ? [
          new HtmlWebpackPlugin({
            inject: true,
            chunks: ['sandbox-startup', 'sandbox'],
            filename: 'frame.html',
            template: paths.sandboxHtml,
            minify: __PROD__ && {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }),
        ]
      : [
          // Generates an `index.html` file with the <script> injected.
          new HtmlWebpackPlugin({
            inject: true,
            chunks: __PROD__ ? ['common-sandbox', 'common', 'app'] : ['app'],
            chunksSortMode: 'manual',
            filename: 'app.html',
            template: paths.appHtml,
            minify: __PROD__ && {
              removeComments: false,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }),
          new HtmlWebpackPlugin({
            inject: true,
            chunks: __PROD__
              ? [
                  'sandbox-startup',
                  'common-sandbox',
                  'vendors~sandbox',
                  'sandbox',
                ]
              : ['sandbox-startup', 'sandbox'],
            chunksSortMode: 'manual',
            filename: 'frame.html',
            template: paths.sandboxHtml,
            minify: __PROD__ && {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }),
          new HtmlWebpackPlugin({
            inject: true,
            chunks: __PROD__
              ? ['common-sandbox', 'common', 'embed']
              : ['embed'],
            chunksSortMode: 'manual',
            filename: 'embed.html',
            template: path.join(paths.embedSrc, 'index.html'),
            minify: __PROD__ && {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }),
        ]),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `env.js`.
    new webpack.DefinePlugin(env),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),

    // With this plugin we override the load-rules of eslint, this function prevents
    // us from using eslint in the browser, therefore we need to stop it!
    !SANDBOX_ONLY &&
      new webpack.NormalModuleReplacementPlugin(
        new RegExp(['eslint', 'lib', 'load-rules'].join(sepRe)),
        path.join(paths.config, 'stubs/load-rules.compiled.js')
      ),

    // DON'T TOUCH THIS. There's a bug in Webpack 4 that causes bundle splitting
    // to break when using lru-cache. So we literally gice them our own version
    new webpack.NormalModuleReplacementPlugin(
      /^lru-cache$/,
      path.join(paths.config, 'stubs/lru-cache.js')
    ),

    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // Make the monaco editor work
    new CopyWebpackPlugin(
      [
        // Our own custom version of monaco
        {
          from: __DEV__
            ? '../../standalone-packages/monaco-editor/release/dev/vs'
            : '../../standalone-packages/monaco-editor/release/min/vs',
          to: 'public/13/vs',
          force: true,
        },
        __PROD__ && {
          from: '../../node_modules/monaco-editor/min-maps',
          to: 'public/min-maps',
        },
        {
          from: '../../node_modules/onigasm/lib/onigasm.wasm',
          to: 'public/onigasm/2.2.1/onigasm.wasm',
        },
        {
          from: '../../node_modules/monaco-vue/release/min',
          to: 'public/13/vs/language/vue',
        },
        {
          from: 'static',
          to: 'static',
        },
        {
          from: '../../standalone-packages/codesandbox-browserfs/dist',
          to: 'static/browserfs',
        },
      ].filter(x => x)
    ),
  ].filter(Boolean),
};
