import { getAbsoluteDependencies } from '@codesandbox/common/lib/utils/dependencies';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';

import { getGlobal } from '@codesandbox/common/lib/utils/global';
import { Sandbox } from '@codesandbox/common/lib/types';
import {
  getModulePath,
  getDirectoryPath,
} from '@codesandbox/common/lib/sandbox/modules';
import { dirname } from '@codesandbox/common/lib/utils/path';

const global = getGlobal() as Window & { BrowserFS: any };

const fs = global.BrowserFS.BFSRequire('fs');
const SERVICE_URL = 'https://ata-fetcher.cloud/api/v5/typings';

let lastMTime = new Date(0);

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

function getPopulatedModulesByPath(sandbox: Sandbox) {
  const modulesObject = {};

  if (!sandbox) {
    return modulesObject;
  }

  sandbox.modules.forEach(m => {
    const path = getModulePath(sandbox.modules, sandbox.directories, m.id);
    if (path) {
      modulesObject[path] = { ...m, type: 'file' };
    }
  });

  sandbox.directories.forEach(d => {
    const path = getDirectoryPath(sandbox.modules, sandbox.directories, d.id);

    // If this is a single directory with no children
    if (!Object.keys(modulesObject).some(p => dirname(p) === path)) {
      modulesObject[path] = { ...d, type: 'directory' };
    }
  });

  return modulesObject;
}

function sendFiles(sandbox: Sandbox) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line
    console.info('## SYNC FILES');
  }
  global.postMessage(
    {
      $broadcast: true,
      $type: 'file-sync',
      $data: getPopulatedModulesByPath(sandbox),
    },
    protocolAndHost()
  );

  try {
    fs.stat('/sandbox/package.json', (packageJsonError, stat) => {
      if (packageJsonError) {
        return;
      }

      if (stat.mtime.toString() !== lastMTime.toString()) {
        lastMTime = stat.mtime;

        fs.readFile(
          '/sandbox/package.json',
          async (packageJsonReadError, rv) => {
            if (packageJsonReadError) {
              console.error(packageJsonReadError);
              return;
            }

            fs.stat('/sandbox/tsconfig.json', (tsConfigError, result) => {
              // If tsconfig exists we want to sync the types
              syncDependencyTypings(
                rv.toString(),
                Boolean(tsConfigError) || !result
              );
            });
          }
        );
      }
    });
  } catch (e) {
    // Do nothing
  }
}

type OnModulesByPathChange = (cb: () => void) => () => void;

export default {
  initialize({
    onModulesByPathChange,
    getCurrentSandbox,
  }: {
    onModulesByPathChange: OnModulesByPathChange;
    getCurrentSandbox: () => Sandbox;
  }) {
    onModulesByPathChange(() => {
      sendFiles(getCurrentSandbox());
    });
    // eslint-disable-next-line
    self.addEventListener('message', evt => {
      if (evt.data.$type === 'request-data') {
        sendTypes();
        sendFiles(getCurrentSandbox());
      }
    });
  },
};
