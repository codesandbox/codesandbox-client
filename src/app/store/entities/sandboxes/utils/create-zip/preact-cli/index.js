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
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><%= htmlWebpackPlugin.options.title %></title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="manifest" href="/manifest.json">
    <% if (htmlWebpackPlugin.options.manifest.theme_color) { %>
      <meta name="theme-color" content="<%= htmlWebpackPlugin.options.manifest.theme_color %>">
    <% } %>
    <% for (var chunk of webpack.chunks) { %>
      <% if (chunk.names.length === 1 && chunk.names[0] === 'polyfills') continue; %>
      <% for (var file of chunk.files) { %>
        <% if (htmlWebpackPlugin.options.preload && file.match(/\.(js|css)$/)) { %>
          <link rel="preload" href="<%= htmlWebpackPlugin.files.publicPath + file %>" as="<%= file.match(/\.css$/)?'style':'script' %>">
        <% } else if (file.match(/manifest\.json$/)) { %>
          <link rel="manifest" href="<%= htmlWebpackPlugin.files.publicPath + file %>">
        <% } %>
      <% } %>
    <% } %>
    ${resources.map(getResourceTag).join('\n')}
  </head>
  <body>
    ${getIndexHtmlBody(modules)}
    <%= htmlWebpackPlugin.options.ssr({
      url: '/'
    }) %>
    <script defer src="<%= htmlWebpackPlugin.files.chunks['bundle'].entry %>"></script>
    <script>window.fetch||document.write('<script src="<%= htmlWebpackPlugin.files.chunks["polyfills"].entry %>"><\/script>')</script>
  </body>
</html>
`;

export default function createZip(
  zip,
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  const src = zip.folder('src');
  return src.loadAsync(files).then(src => {
    modules
      .filter(x => x.directoryShortid == null)
      .filter(x => x.title !== 'index.html') // This will be included in the body
      .forEach(x => src.file(x.title, x.code));

    directories
      .filter(x => x.directoryShortid == null)
      .forEach(x => createDirectoryWithFiles(modules, directories, x, src));

    if (
      modules.filter(
        m => m.directoryShortid == null && m.title === 'index.html'
      ).length ||
      sandbox.externalResources.length
    ) {
      src.file('template.html', getHTML(modules, sandbox.externalResources));
    }

    zip.file(
      'package.json',
      createPackageJSON(
        sandbox,
        {},
        {
          eslint: '^4.5.0',
          'eslint-config-synacor': '^1.1.0',
          'if-env': '^1.0.0',
          less: '^2.7.2',
          'less-loader': '^4.0.5',
          'node-sass': '^4.5.3',
          'preact-cli': '^1.4.1',
          'sass-loader': '^6.0.6',
          stylus: '^0.54.5',
          'stylus-loader': '^3.0.1',
        },
        {
          test: 'eslint . && preact test',
          start:
            'if-env NODE_ENV=production && npm run -s serve || npm run -s dev',
          build: 'preact build',
          serve: 'preact build && preact serve',
          dev: 'preact watch',
        },
        {
          eslintConfig: {
            extends: 'eslint-config-synacor',
          },
        }
      )
    );
  });
}
