// @flow
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import type { Sandbox, Module, Directory } from 'common/types';
import { react, reactTs, vue, preact, svelte } from 'common/templates/index';
import { resolveModule } from 'common/sandbox/modules';

const CSSTag = (resource: string) =>
  `<link rel="stylesheet" type="text/css" href="${resource}" media="all">`;
const JSTag = (resource: string) =>
  `<script src="${resource}" async="false"></script>`;

export function getResourceTag(resource: string) {
  const kind = resource.match(/\.([^.]*)$/);

  if (kind && kind[1] === 'css') {
    return CSSTag(resource);
  }

  return JSTag(resource);
}

export function getIndexHtmlBody(
  modules: Array<Module>,
  directories: Array<Directory>
) {
  let indexHtmlModule = modules.find(
    m => m.title === 'index.html' && m.directoryShortid == null
  );

  if (!indexHtmlModule && directories) {
    try {
      indexHtmlModule = resolveModule(
        'public/index.html',
        modules,
        directories
      );
    } catch (e) {
      /* ignore */
    }
  }

  if (indexHtmlModule) {
    return indexHtmlModule.code || '';
  }

  return `<div id="root"></div>`;
}

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

export function createPackageJSON(
  sandbox: Sandbox,
  dependencies: Object,
  devDependencies: Object,
  scripts: Object,
  extra: Object
) {
  const name = slugify(sandbox.title || sandbox.id);
  const version = `0.0.${sandbox.version}`;
  const npmDependencies =
    typeof sandbox.npmDependencies.toJS === 'function'
      ? sandbox.npmDependencies.toJS()
      : sandbox.npmDependencies;

  return JSON.stringify(
    {
      name,
      description: sandbox.description,
      version,
      dependencies: { ...npmDependencies, ...dependencies },
      devDependencies,
      scripts,
      ...(extra || {}),
    },
    null,
    '  '
  );
}

export async function createFile(module: Module, zip) {
  if (module.isBinary) {
    const code = await window.fetch(module.code).then(x => {
      const contentType = x.headers['Content-Type'];

      if (contentType && contentType.startsWith('text/plain')) {
        return x.text();
      }

      return x.blob();
    });

    return zip.file(module.title, code);
  }

  return zip.file(module.title, module.code);
}

export async function createDirectoryWithFiles(
  modules: Array<Module>,
  directories: Array<Directory>,
  directory: Directory,
  zip
) {
  const newZip = zip.folder(directory.title);

  await Promise.all(
    modules
      .filter(x => x.directoryShortid === directory.shortid)
      .map(x => createFile(x, newZip))
  );

  await Promise.all(
    directories
      .filter(x => x.directoryShortid === directory.shortid)
      .map(x => createDirectoryWithFiles(modules, directories, x, newZip))
  );
}

export async function createZip(
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  const zip = new JSZip();

  let promise = null;

  if (
    sandbox.template !== vue.name &&
    sandbox.template !== reactTs.name &&
    directories.find(m => m.title === 'src' && m.directoryShortid == null)
  ) {
    // This is a full project, with all files already in there. We need to create
    // a zip by just adding all existing files to it (downloading binaries too).
    promise = import(/* webpackChunkName: 'full-zip' */ './full').then(
      generator => generator.default(zip, sandbox, modules, directories)
    );
  } else if (sandbox.template === react.name) {
    promise = import(/* webpackChunkName: 'create-react-app-zip' */ './create-react-app').then(
      generator => generator.default(zip, sandbox, modules, directories)
    );
  } else if (sandbox.template === reactTs.name) {
    promise = import(/* webpackChunkName: 'create-react-app-typescript-zip' */ './create-react-app-typescript').then(
      generator => generator.default(zip, sandbox, modules, directories)
    );
  } else if (sandbox.template === vue.name) {
    promise = import(/* webpackChunkName: 'vue-zip' */ './vue-cli').then(
      generator => generator.default(zip, sandbox, modules, directories)
    );
  } else if (sandbox.template === preact.name) {
    promise = import(/* webpackChunkName: 'preact-zip' */ './preact-cli').then(
      generator => generator.default(zip, sandbox, modules, directories)
    );
  } else if (sandbox.template === svelte.name) {
    promise = import(/* webpackChunkName: 'svelte-zip' */ './svelte').then(
      generator => generator.default(zip, sandbox, modules, directories)
    );
  } else {
    // If no specific zip generator is found we will default to the full generator
    promise = import(/* webpackChunkName: 'full-zip' */ './full').then(
      generator => generator.default(zip, sandbox, modules, directories)
    );
  }

  if (promise) {
    await promise;
    const file = await zip.generateAsync({ type: 'blob' });

    return file;
  }

  return null;
}

export async function getZip(
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  const file = await createZip(sandbox, modules, directories);
  return { file };
}

export default (async function downloadZip(
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  const file = await createZip(sandbox, modules, directories);

  if (file) {
    saveAs(file, `${slugify(sandbox.title || sandbox.id)}.zip`);
  }
});
