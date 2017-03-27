// @flow
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import type { Sandbox } from './entity';
import type { Module } from './modules/entity';
import type { Directory } from './directories/entity';

import README from './README.md';

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

  if (
    !modules.find(x => x.directoryShortid == null && x.title === 'README.md')
  ) {
    zip.file('README.md', README);
  }
  zip.file('package.json', createPackageJSON(sandbox));

  const file = await zip.generateAsync({ type: 'blob' });

  saveAs(file, `${sandbox.title || sandbox.id}.zip`);
});
