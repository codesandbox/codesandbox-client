import { dirname } from 'path';

import { getAbsoluteDependencies } from '@codesandbox/common/lib/utils/dependencies';
import { getGlobal } from '@codesandbox/common/lib/utils/global';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { json } from 'overmind';
import {
  getDirectoryPath,
  getModulePath,
} from '@codesandbox/common/lib/sandbox/modules';
import { SandboxFs, Module, Directory } from '@codesandbox/common/lib/types';
import { EXTENSIONS_LOCATION } from '../constants';
import { getTypeFetcher } from '../extensionHostWorker/common/type-downloader';
import { writeFile, rename, rmdir, unlink, mkdir } from './utils';

const global = getGlobal() as Window & { BrowserFS: any };

const browserFs = global.BrowserFS.BFSRequire('fs');
const SERVICE_URL = 'https://ata-fetcher.cloud/api/v5/typings';

let lastMTime = new Date(0);

declare global {
  interface Window {
    BrowserFS: any;
  }
}

function sendTypes() {
  global.postMessage(
    {
      $broadcast: true,
      $type: 'typings-sync',
      $data: types,
    },
    protocolAndHost()
  );
}

let typeInfoPromise;
let types;

/**
 * Gets all entries of dependencies -> @types/ version
 */
function getTypesInfo() {
  if (typeInfoPromise) {
    return typeInfoPromise;
  }

  typeInfoPromise = fetch('https://unpkg.com/types-registry@latest/index.json')
    .then(x => x.json())
    .then(x => x.entries);

  return typeInfoPromise;
}

async function syncDependencyTypings(
  packageJSON: string,
  autoInstallTypes: boolean
) {
  try {
    types = {};
    const { dependencies = {}, devDependencies = {} } = JSON.parse(packageJSON);

    const totalDependencies = {
      '@types/jest': 'latest',
      ...dependencies,
      ...devDependencies,
    };

    if (autoInstallTypes) {
      const typeInfo = await getTypesInfo();
      Object.keys(totalDependencies).forEach(async dep => {
        if (
          !dep.startsWith('@types/') &&
          !totalDependencies[`@types/${dep}`] &&
          typeInfo[dep]
        ) {
          totalDependencies[`@types/${dep}`] = typeInfo[dep].latest;
        }
      });
    }

    const absoluteDependencies = await getAbsoluteDependencies(
      totalDependencies
    );

    return Promise.all(
      Object.keys(absoluteDependencies).map(async depName => {
        const depVersion = absoluteDependencies[depName];

        try {
          const fetchRequest = await fetch(
            `${SERVICE_URL}/${depName}@${depVersion}.json`
          );

          if (!fetchRequest.ok) {
            throw new Error('Fetch error');
          }

          const { files } = await fetchRequest.json();
          types = { ...types, ...files };
          sendTypes();
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Trouble fetching types for ' + depName);
          }
        }
      })
    );
  } catch (e) {
    /* ignore */
    return Promise.resolve({});
  }
}

function sendSandboxFs(sandboxFs) {
  global.postMessage(
    {
      $broadcast: true,
      $type: 'sandbox-fs',
      $data: json(sandboxFs),
    },
    protocolAndHost()
  );

  try {
    browserFs.stat('/sandbox/package.json', (packageJsonError, stat) => {
      if (packageJsonError) {
        return;
      }

      if (stat.mtime.toString() !== lastMTime.toString()) {
        lastMTime = stat.mtime;

        browserFs.readFile(
          '/sandbox/package.json',
          async (packageJsonReadError, rv) => {
            if (packageJsonReadError) {
              console.error(packageJsonReadError);
              return;
            }

            browserFs.stat(
              '/sandbox/tsconfig.json',
              (tsConfigError, result) => {
                // If tsconfig exists we want to sync the types
                syncDependencyTypings(
                  rv.toString(),
                  Boolean(tsConfigError) || !result
                );
              }
            );
          }
        );
      }
    });
  } catch (e) {
    // Do nothing
  }
}

export default {
  initialize(options: { getSandboxFs: () => SandboxFs }) {
    self.addEventListener('message', evt => {
      if (evt.data.$type === 'request-data') {
        sendTypes();
        sendSandboxFs(options.getSandboxFs());
      }
    });

    sendSandboxFs(options.getSandboxFs());

    return new Promise((resolve, reject) => {
      window.BrowserFS.configure(
        {
          fs: 'MountableFileSystem',
          options: {
            '/': { fs: 'InMemory', options: {} },
            '/sandbox': {
              fs: 'CodeSandboxEditorFS',
              options: {
                api: {
                  getSandboxFs: options.getSandboxFs,
                },
              },
            },
            '/sandbox/node_modules': {
              fs: 'CodeSandboxFS',
              options: getTypeFetcher().options,
            },
            '/vscode': {
              fs: 'LocalStorage',
            },
            '/home': {
              fs: 'LocalStorage',
            },
            '/extensions': {
              fs: 'BundledHTTPRequest',
              options: {
                index: EXTENSIONS_LOCATION + '/extensions/index.json',
                baseUrl: EXTENSIONS_LOCATION + '/extensions',
                bundle: EXTENSIONS_LOCATION + '/bundles/main.min.json',
                logReads: process.env.NODE_ENV === 'development',
              },
            },
            '/extensions/custom-theme': {
              fs: 'InMemory',
            },
          },
        },
        async e => {
          if (e) {
            reject(e);
          } else {
            resolve();
          }
        }
      );
    });
  },

  create(modules: Module[], directories: Directory[]): SandboxFs {
    const paths = {};

    modules.forEach(m => {
      const path = getModulePath(modules, directories, m.id);
      if (path) {
        paths[path] = {
          ...m,
          type: 'file',
        };
      }
    });

    directories.forEach(d => {
      const path = getDirectoryPath(modules, directories, d.id);

      // If this is a single directory with no children
      if (!Object.keys(paths).some(p => dirname(p) === path)) {
        paths[path] = { ...d, type: 'directory' };
      }
    });

    return paths;
  },

  writeFile(fs: SandboxFs, path: string, module: Module) {
    writeFile(fs, path, module);
    global.postMessage(
      {
        $broadcast: true,
        $type: 'write-file',
        $data: {
          path,
          module: json(module),
        },
      },
      protocolAndHost()
    );
  },

  rename(fs: SandboxFs, fromPath: string, toPath: string) {
    rename(fs, fromPath, toPath);
    global.postMessage(
      {
        $broadcast: true,
        $type: 'rename',
        $data: {
          fromPath,
          toPath,
        },
      },
      protocolAndHost()
    );
  },

  rmdir(fs: SandboxFs, removePath: string) {
    rmdir(fs, removePath);
    global.postMessage(
      {
        $broadcast: true,
        $type: 'rmdir',
        $data: {
          removePath,
        },
      },
      protocolAndHost()
    );
  },

  unlink(fs: SandboxFs, removePath: string) {
    unlink(fs, removePath);
    global.postMessage(
      {
        $broadcast: true,
        $type: 'unlink',
        $data: {
          removePath,
        },
      },
      protocolAndHost()
    );
  },

  mkdir(fs: SandboxFs, path: string, directory: Directory) {
    mkdir(fs, path, directory);
    global.postMessage(
      {
        $broadcast: true,
        $type: 'mkdir',
        $data: {
          path,
          directory: json(directory),
        },
      },
      protocolAndHost()
    );
  },
};
