// @flow
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import type { Sandbox, Module, Directory } from 'common/types';

/* eslint-disable */
import favicon from '!base64-loader!./cra-files/favicon.ico'; // $FlowIssue
import gitignore from '!raw-loader!./cra-files/.gitignore'; // $FlowIssue
import manifest from '!raw-loader!./cra-files/manifest.json'; // $FlowIssue
import serviceWorker from '!raw-loader!./cra-files/createServiceWorker'; // $FlowIssue
import README from './cra-files/README.md'; // $FlowIssue
/* eslint-enable */

const CSSTag = (resource: string) =>
  `<link rel="stylesheet" type="text/css" href="${resource}" media="all">`;
const JSTag = (resource: string) =>
  `<script src="${resource}" async="false"></script>`;

function getResourceTag(resource: string) {
  const kind = resource.match(/\.([^.]*)$/);

  if (kind && kind[1] === 'css') {
    return CSSTag(resource);
  }

  return JSTag(resource);
}

function getIndexHtmlBody(modules: Array<Module>) {
  const indexHtmlModule = modules.find(
    m => m.title === 'index.html' && m.directoryShortid == null,
  );

  if (indexHtmlModule) {
    return indexHtmlModule.code || '';
  }

  return `<div id="root"></div>`;
}

const getHTML = (modules, resources) =>
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <!--
      manifest.json provides metadata used when your web app is added to the
      homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the \`public\` folder during the build.
      Only files inside the \`public\` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running \`npm run build\`.
    -->
    <title>React App</title>
    ${resources.map(getResourceTag).join('\n')}
  </head>
  <body>
    ${getIndexHtmlBody(modules)}
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run \`npm start\` or \`yarn start\`.
      To create a production bundle, use \`npm run build\` or \`yarn build\`.
    -->
  </body>
</html>
`;

function slugify(text) {
  const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
  const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
  const p = new RegExp(a.split('').join('|'), 'g');

  /* eslint-disable */
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special chars
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
  /* eslint-enable */
}

function createPackageJSON(sandbox: Sandbox) {
  const name = slugify(sandbox.title || sandbox.id);
  const version = `0.0.${sandbox.version}`;

  return JSON.stringify(
    {
      name,
      description: sandbox.description,
      version,
      dependencies: sandbox.npmDependencies,
      devDependencies: {
        'react-scripts': '1.0.0',
      },
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test --env=jsdom',
        eject: 'react-scripts eject',
      },
    },
    null,
    '  ',
  );
}

function createDirectoryWithFiles(
  modules: Array<Module>,
  directories: Array<Directory>,
  directory: Directory,
  zip,
) {
  const newZip = zip.folder(directory.title);

  modules
    .filter(x => x.directoryShortid === directory.shortid)
    .forEach(x => newZip.file(x.title, x.code));

  directories
    .filter(x => x.directoryShortid === directory.shortid)
    .forEach(x => createDirectoryWithFiles(modules, directories, x, newZip));
}

export default (async function createZip(
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>,
) {
  const zip = new JSZip();

  const src = zip.folder('src');
  src.file('createServiceWorker.js', serviceWorker);
  modules
    .filter(x => x.directoryShortid == null)
    .filter(x => x.title !== 'index.html') // This will be included in the body
    .forEach(x => src.file(x.title, x.code));

  directories
    .filter(x => x.directoryShortid == null)
    .forEach(x => createDirectoryWithFiles(modules, directories, x, src));

  const publicFolder = zip.folder('public');

  publicFolder.file('favicon.ico', favicon, {
    base64: true,
  });

  publicFolder.file('index.html', getHTML(modules, sandbox.externalResources));
  publicFolder.file('manifest.json', manifest);

  if (
    !modules.find(x => x.directoryShortid == null && x.title === 'README.md')
  ) {
    zip.file('README.md', README);
  }
  zip.file('package.json', createPackageJSON(sandbox));
  zip.file('.gitignore', gitignore);

  const file = await zip.generateAsync({ type: 'blob' });

  saveAs(file, `${slugify(sandbox.title || sandbox.id)}.zip`);
});
