import type { Sandbox, Module, Directory } from 'common/types';

import files from 'buffer-loader!./files.zip';
import {
  getResourceTag,
  getIndexHtmlBody,
  createPackageJSON,
  createDirectoryWithFiles,
} from '../';

const getHTML = (modules, resources) =>
  `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>vue</title>
  ${resources.map(getResourceTag).join('\n')}
</head>
<body>
  ${getIndexHtmlBody(modules)}
</body>
</html>
`;

const README = `
# vue

> A Vue.js project

## Build Setup

\`\`\` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
\`\`\`

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
`;

export default function createZip(
  zip,
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>,
) {
  zip.file('README.md', README);

  return zip.loadAsync(files).then(zip => {
    const src = zip.folder('src');
    modules
      .filter(x => x.directoryShortid == null)
      .filter(x => x.title !== 'index.html') // This will be included in the body
      .forEach(x => src.file(x.title, x.code));

    directories
      .filter(x => x.directoryShortid == null)
      .forEach(x => createDirectoryWithFiles(modules, directories, x, src));

    zip.file('index.html', getHTML(modules, sandbox.externalResources));

    zip.file(
      'package.json',
      createPackageJSON(
        sandbox,
        {},
        {
          autoprefixer: '^7.1.2',
          'babel-core': '^6.22.1',
          'babel-eslint': '^7.1.1',
          'babel-loader': '^7.1.1',
          'babel-plugin-istanbul': '^4.1.1',
          'babel-plugin-transform-runtime': '^6.22.0',
          'babel-preset-env': '^1.3.2',
          'babel-preset-stage-2': '^6.22.0',
          'babel-register': '^6.22.0',
          chai: '^3.5.0',
          chalk: '^2.0.1',
          chromedriver: '^2.27.2',
          'connect-history-api-fallback': '^1.3.0',
          'copy-webpack-plugin': '^4.0.1',
          'cross-env': '^5.0.1',
          'cross-spawn': '^5.0.1',
          'css-loader': '^0.28.0',
          cssnano: '^3.10.0',
          eslint: '^3.19.0',
          'eslint-config-standard': '^6.2.1',
          'eslint-friendly-formatter': '^3.0.0',
          'eslint-loader': '^1.7.1',
          'eslint-plugin-html': '^3.0.0',
          'eslint-plugin-promise': '^3.4.0',
          'eslint-plugin-standard': '^2.0.1',
          'eventsource-polyfill': '^0.9.6',
          express: '^4.14.1',
          'extract-text-webpack-plugin': '^2.0.0',
          'file-loader': '^0.11.1',
          'friendly-errors-webpack-plugin': '^1.1.3',
          'html-webpack-plugin': '^2.28.0',
          'http-proxy-middleware': '^0.17.3',
          'inject-loader': '^3.0.0',
          karma: '^1.4.1',
          'karma-coverage': '^1.1.1',
          'karma-mocha': '^1.3.0',
          'karma-phantomjs-launcher': '^1.0.2',
          'karma-phantomjs-shim': '^1.4.0',
          'karma-sinon-chai': '^1.3.1',
          'karma-sourcemap-loader': '^0.3.7',
          'karma-spec-reporter': '0.0.31',
          'karma-webpack': '^2.0.2',
          less: '^2.7.2',
          'less-loader': '^4.0.5',
          lolex: '^1.5.2',
          mocha: '^3.2.0',
          nightwatch: '^0.9.12',
          'node-sass': '^4.5.3',
          opn: '^5.1.0',
          'optimize-css-assets-webpack-plugin': '^2.0.0',
          ora: '^1.2.0',
          'phantomjs-prebuilt': '^2.1.14',
          rimraf: '^2.6.0',
          'sass-loader': '^6.0.6',
          'selenium-server': '^3.0.1',
          semver: '^5.3.0',
          shelljs: '^0.7.6',
          sinon: '^2.1.0',
          'sinon-chai': '^2.8.0',
          stylus: '^0.54.5',
          'stylus-loader': '^3.0.1',
          'ts-loader': '^2.3.3',
          typescript: '^2.4.2',
          'url-loader': '^0.5.8',
          'vue-loader': '^12.1.0',
          'vue-style-loader': '^3.0.1',
          'vue-template-compiler': '^2.3.3',
          webpack: '^2.6.1',
          'webpack-bundle-analyzer': '^2.2.1',
          'webpack-dev-middleware': '^1.10.0',
          'webpack-hot-middleware': '^2.18.0',
          'webpack-merge': '^4.1.0',
        },
        {
          dev: 'node build/dev-server.js',
          start: 'node build/dev-server.js',
          build: 'node build/build.js',
          unit:
            'cross-env BABEL_ENV=test karma start test/unit/karma.conf.js --single-run',
          e2e: 'node test/e2e/runner.js',
          test: 'npm run unit && npm run e2e',
          lint: 'eslint --ext .js,.vue src test/unit/specs test/e2e/specs',
        },
        {
          engines: {
            node: '>= 4.0.0',
            npm: '>= 3.0.0',
          },
          browserslist: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        },
      ),
    );
  });
}
