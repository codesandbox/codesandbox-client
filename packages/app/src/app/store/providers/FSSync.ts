import { Provider } from 'cerebral';
import { getAbsoluteDependencies } from 'common/utils/dependencies';

const fs = BrowserFS.BFSRequire('fs');
const SERVICE_URL = 'https://ata-fetcher.cloud/api/v2/typings';

let fileInterval;

let types;
let lastMTime = new Date(0);

function sendTypes() {
  self.postMessage({
    $broadcast: true,
    $type: 'typings-sync',
    $data: types,
  });
}

async function syncDependencyTypings(
  packageJSON: string,
  autoInstallTypes: boolean
) {
  try {
    types = {};
    const { dependencies = {}, devDependencies = {} } = JSON.parse(packageJSON);

    const totalDependencies = {
      ...dependencies,
      ...devDependencies,
    };

    // Add @types/... versions if they are not there
    // TODO: apply this to /.cache/typescript/3.1

    if (autoInstallTypes) {
      Object.keys(totalDependencies).forEach(dep => {
        if (!dep.startsWith('@types/') && !totalDependencies[`@types/${dep}`]) {
          totalDependencies[`@types/${dep}`] = 'latest';
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
      const { modulesByPath } = this.context.controller.getState().editor;

      self.postMessage({
        $broadcast: true,
        $type: 'file-sync',
        $data: modulesByPath,
      });
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
      } catch (e) {}
    }, 1000);

    self.addEventListener('message', evt => {
      if (evt.data.$type === 'request-data') {
        sendTypes();
        sendFiles();
      }
    });
  },
});
