// @flow
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import type { Sandbox } from './entity';
import type { Module } from './modules/entity';
import type { Directory } from './directories/entity';

import README from './README.md';
import favicon from '!base64-loader!./favicon.ico';

const CSSTag = (resource: string) =>
  `<link rel="stylesheet" type="text/css" href="${resource}" media="all">`;
const JSTag = (resource: string) =>
  `<script src="${resource}" async="false"></script>`;

function getResourceTag(resource: string) {
  const kind = resource.match(/\.([^.]*)$/)[1];

  if (kind === 'css') {
    return CSSTag(resource);
  } else if (kind === 'js') {
    return JSTag(resource);
  }
}

const getHTML = resources => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    <!--
      Notice the use of %PUBLIC_URL% in the tag above.
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
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run \`npm start\`.
      To create a production bundle, use \`npm run build\`.
    -->
  </body>
</html>`;

function slugify(text) {
  const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
  const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
  const p = new RegExp(a.split('').join('|'), 'g');

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
        'react-scripts': '0.9.5',
      },
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test --env=jsdom',
        eject: 'react-scripts eject',
      },
    },
    null,
    '  '
  );
}

function createDirectoryWithFiles(
  modules: Array<Module>,
  directories: Array<Directory>,
  directory: Directory,
  zip
) {
  const newZip = zip.folder(directory.title);

  modules
    .filter(x => x.directoryShortid === directory.id)
    .forEach(x => newZip.file(x.title, x.code));

  directories
    .filter(x => x.directoryShortid === directory.id)
    .forEach(x => createDirectoryWithFiles(modules, directories, x, newZip));
}

export default (async function createZip(
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  const zip = new JSZip();

  const src = zip.folder('src');
  modules
    .filter(x => x.directoryShortid == null)
    .forEach(x => src.file(x.title, x.code));

  directories
    .filter(x => x.directoryShortid == null)
    .forEach(x => createDirectoryWithFiles(modules, directories, x, src));

  const publicFolder = zip.folder('public');
  publicFolder.file('index.html', getHTML(sandbox.externalResources));

  publicFolder.file('favicon.ico', favicon, {
    base64: true,
  });

  if (
    !modules.find(x => x.directoryShortid == null && x.title === 'README.md')
  ) {
    zip.file('README.md', README);
  }
  zip.file('package.json', createPackageJSON(sandbox));

  const file = await zip.generateAsync({ type: 'blob' });

  saveAs(file, `${sandbox.title || sandbox.id}.zip`);
});
