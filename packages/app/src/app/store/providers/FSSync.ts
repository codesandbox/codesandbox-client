import { Provider } from 'cerebral';
import { getAbsoluteDependencies } from 'common/lib/utils/dependencies';
import { protocolAndHost } from 'common/lib/utils/url-generator';

import { getGlobal } from 'common/lib/utils/global'

const global = getGlobal() as Window & { BrowserFS: any };

const fs = global.BrowserFS.BFSRequire('fs');
const SERVICE_URL = 'https://ata-fetcher.cloud/api/v4/typings';

let fileInterval;
let lastMTime = new Date(0);

function sendTypes() {
  global.postMessage({
    $broadcast: true,
    $type: 'typings-sync',
    $data: types,
  }, protocolAndHost());
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

        return fetch(`${SERVICE_URL}/${depName}@${depVersion}.json`)
          .then(x => x.json())
          .then(x => x.files)
          .then(x => {
            types = { ...types, ...x };

            sendTypes();
          })
          .catch(() => {
            console.warn('Trouble fetching types for ' + depName);
            return {};
          });
      })
    );
  } catch (e) {
    /* ignore */
    return Promise.resolve({});
  }
}

export default Provider({
  syncCurrentSandbox() {
    if (fileInterval) {
      clearInterval(fileInterval);
    }

    const sendFiles = () => {
      if (this.context.controller.getState().editor.currentId) {
        const { modulesByPath } = this.context.controller.getState().editor;

        global.postMessage({
          $broadcast: true,
          $type: 'file-sync',
          $data: modulesByPath,
        }, protocolAndHost());
      }
    };

    fileInterval = setInterval(() => {
      sendFiles();

      try {
        fs.stat('/sandbox/package.json', (e, stat) => {
          if (e) {
            return;
          }

          if (stat.mtime.toString() !== lastMTime.toString()) {
            lastMTime = stat.mtime;

            fs.readFile('/sandbox/package.json', async (err, rv) => {
              if (e) {
                console.error(e);
                return;
              }

              fs.stat('/sandbox/tsconfig.json', (err, result) => {
                // If tsconfig exists we want to sync the types
                syncDependencyTypings(rv.toString(), !!err || !result);
              });
            });
          }
        });
      } catch (e) { }
    }, 1000);

    self.addEventListener('message', evt => {
      if (evt.data.$type === 'request-data') {
        sendTypes();
        sendFiles();
      }
    });
  },
});
