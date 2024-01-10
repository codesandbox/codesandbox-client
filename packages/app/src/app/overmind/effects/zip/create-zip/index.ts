import {
  getModulePath,
  resolveModule,
} from '@codesandbox/common/lib/sandbox/modules';
import {
  preact,
  react,
  reactTs,
  vue,
} from '@codesandbox/common/lib/templates/index';
import { Directory, Module, Sandbox } from '@codesandbox/common/lib/types';
import { saveAs } from 'file-saver';
import ignore from 'ignore';
import JSZip from 'jszip';
import { injectExternalResources } from 'app/utils/inject-resources-for-export';

export const BLOB_ID = 'blob-url://';

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
  directories?: Array<Directory>
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
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>,
  scripts: Object,
  extra?: Object
) {
  const name = slugify(sandbox.title || sandbox.id);
  const version = `0.0.${sandbox.version}`;

  const packageJSONModule = sandbox.modules.find(
    m => m.directoryShortid == null && m.title === 'package.json'
  );

  try {
    if (packageJSONModule) {
      const packageJSON = JSON.parse(packageJSONModule.code || '');

      return JSON.stringify(
        {
          ...packageJSON,
          name,
          description: packageJSON.description || sandbox.description,
          version,
          dependencies: {
            ...getDependenciesToAdd(dependencies, packageJSON),
            ...packageJSON.dependencies,
          },
          devDependencies: {
            ...getDependenciesToAdd(devDependencies, packageJSON),
            ...packageJSON.devDependencies,
          },
          scripts: {
            ...scripts,
            ...packageJSON.scripts,
          },
          ...(extra || {}),
        },
        null,
        '  '
      );
    }
  } catch (e) {
    /* fallback */
  }

  const npmDependencies =
    typeof sandbox.npmDependencies.toJS === 'function'
      ? (sandbox.npmDependencies as any).toJS()
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

/**
 * Makes sure that we only add dependencies that are not already
 * in the package.json
 */
function getDependenciesToAdd(
  dependencies: Record<string, string>,
  packageJson: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  }
): Record<string, string> {
  const dependenciesToAdd: Record<string, string> = {};

  const totalPackageJsonDependencies = Object.keys({
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
  });

  for (const dependency of Object.keys(dependencies)) {
    if (!totalPackageJsonDependencies.includes(dependency)) {
      dependenciesToAdd[dependency] = dependencies[dependency];
    }
  }

  return dependenciesToAdd;
}

export async function createFile(
  module: Module,
  zip: JSZip,
  downloadBlobs: boolean = true
) {
  if (module.isBinary && module.code.startsWith('http')) {
    if (downloadBlobs) {
      const code = await window
        .fetch(module.code)
        .then<string | Blob>(response => {
          const contentType = response.headers['Content-Type'];

          if (contentType && contentType.startsWith('text/plain')) {
            return response.text();
          }

          return response.blob();
        });

      return zip.file(module.title, code);
    }

    // Mark that the module is a link to a blob
    const code = `${BLOB_ID}${module.code}`;
    const file = zip.file(module.title, code);

    return file;
  }

  return zip.file(module.title, module.code);
}

export async function createDirectoryWithFiles(
  modules: Array<Module>,
  directories: Array<Directory>,
  directory: Directory,
  zip: JSZip,
  downloadBlobs: boolean = true
) {
  const newZip = zip.folder(directory.title);

  if (!newZip) {
    return;
  }

  await Promise.all(
    modules
      .filter(x => x.directoryShortid === directory.shortid)
      .map(x => createFile(x, newZip, downloadBlobs))
  );

  await Promise.all(
    directories
      .filter(x => x.directoryShortid === directory.shortid)
      .map(x =>
        createDirectoryWithFiles(modules, directories, x, newZip, downloadBlobs)
      )
  );
}

export async function createZip(
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>,
  downloadBlobs: boolean = true,
  useGitIgnore: boolean = false
) {
  const zip = new JSZip();
  const ignorer = ignore();

  if (useGitIgnore) {
    const gitIgnore = modules.find(
      module =>
        module.title === '.gitignore' && module.directoryShortid === null
    );

    ignorer.add(gitIgnore ? gitIgnore.code : '');
  }

  let modifiedModules = modules;

  if (sandbox.externalResources?.length > 0) {
    modifiedModules = injectExternalResources(
      modules,
      sandbox.externalResources
    );
  }

  const filteredModules = modifiedModules.filter(module => {
    // Relative path
    const path = getModulePath(modules, directories, module.id).substring(1);
    return !ignorer.ignores(path);
  });

  const fullPromise = () =>
    import(/* webpackChunkName: 'full-zip' */ './full').then(generator =>
      generator.default(
        zip,
        sandbox,
        filteredModules,
        directories,
        downloadBlobs
      )
    );

  let promise: Promise<any> | null = null;

  if (
    sandbox.template !== vue.name &&
    sandbox.template !== reactTs.name &&
    directories.find(m => m.title === 'src' && m.directoryShortid == null)
  ) {
    // This is a full project, with all files already in there. We need to create
    // a zip by just adding all existing files to it (downloading binaries too).
    promise = fullPromise();
  } else if (sandbox.template === react.name) {
    promise = import(
      /* webpackChunkName: 'create-react-app-zip' */ './create-react-app'
    ).then(generator =>
      generator.default(zip, sandbox, filteredModules, directories)
    );
  } else if (sandbox.template === reactTs.name) {
    promise = import(
      /* webpackChunkName: 'create-react-app-typescript-zip' */ './create-react-app-typescript'
    ).then(generator =>
      generator.default(zip, sandbox, filteredModules, directories)
    );
  } else if (sandbox.template === vue.name) {
    try {
      const packageJSONModule = sandbox.modules.find(
        m => m.directoryShortid == null && m.title === 'package.json'
      );

      const pkgJSON = packageJSONModule?.code
        ? JSON.parse(packageJSONModule.code)
        : {};
      if (
        pkgJSON.devDependencies &&
        pkgJSON.devDependencies['@vue/cli-service']
      ) {
        // For the new vue cli we want to use the full promise
        promise = fullPromise();
      } else {
        promise = import(
          /* webpackChunkName: 'vue-zip' */ './vue-cli'
        ).then(generator =>
          generator.default(zip, sandbox, filteredModules, directories)
        );
      }
    } catch (e) {
      promise = fullPromise();
    }
  } else if (sandbox.template === preact.name) {
    promise = import(
      /* webpackChunkName: 'preact-zip' */ './preact-cli'
    ).then(generator =>
      generator.default(zip, sandbox, filteredModules, directories)
    );
  } else {
    // If no specific zip generator is found we will default to the full generator
    promise = import(
      /* webpackChunkName: 'full-zip' */ './full'
    ).then(generator =>
      generator.default(
        zip,
        sandbox,
        filteredModules,
        directories,
        downloadBlobs
      )
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
