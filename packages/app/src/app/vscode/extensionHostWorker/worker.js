import loader from '../dev-bootstrap';
import _debug from 'app/utils/debug';
// import extensionsBuffer from 'buffer-loader!vscode/extensions-bundle/extensions/extensions.zip';

const debug = _debug('cs:cp-worker');

debug('Starting Worker');

function syncFile(fs, path: string, target: string) {
  return new Promise(resolve => {
    fs.readFile(path, (e, str) => {
      if (e) {
        try {
          fs.unlinkSync(target);
        } catch (e) {
          /* */
        }
        resolve();
        return;
      }

      fs.writeFileSync(target, str);
      resolve();
    });
  });
}

function syncDirectory(fs, path: string, target: string) {
  return new Promise(resolve => {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target);
    }

    fs.readdir(path, (e, entries) => {
      if (e) {
        resolve();
        return;
      }

      const promise = Promise.all(
        entries.map(
          entry =>
            new Promise(r => {
              const fullEntry = path + '/' + entry;
              const fullTarget = target + '/' + entry;
              fs.stat(fullEntry, (err, stat) => {
                if (err) {
                  try {
                    fs.unlinkSync(target);
                  } catch (e) {
                    /* */
                  }
                  r();
                  return;
                }

                if (stat.isDirectory()) {
                  r(syncDirectory(fs, fullEntry, fullTarget));
                } else {
                  r(syncFile(fs, fullEntry, fullTarget));
                }
              });
            })
        )
      );

      resolve(promise);
    });
  });
}

async function initializeBrowserFS() {
  return new Promise(resolve => {
    BrowserFS.configure(
      {
        fs: 'MountableFileSystem',
        options: {
          '/': { fs: 'InMemory', options: {} },
          '/tmp': { fs: 'InMemory', options: {} },
          '/worker': { fs: 'WorkerFS', options: { worker: self } },
          '/sandbox': {
            fs: 'DynamicHTTPRequest',
            options: {
              index: '/sw-api/index.json',
              baseUrl: '/sw-api',
            },
          },
          '/vscode': {
            fs: 'InMemory',
            options: {},
          },
          // '/extensions': {
          //   fs: 'ZipFS',
          //   options: {
          //     zipData: extensionsBuffer,
          //   },
          // },
          '/extensions': {
            fs: 'HTTPRequest',
            options: {
              index: '/vscode/extensions-bundle/extensions/index.json',
              baseUrl: '/vscode/extensions-bundle/extensions',
            },
          },
          // '/vscode': {
          //   fs: 'AsyncMirror',
          //   options: {
          //     sync: {
          //       fs: 'InMemory',
          //     },
          //     async: {
          //       fs: 'IndexedDB',
          //       options: {
          //         storeName: 'VSCode',
          //       },
          //     },
          //   },
          // },
        },
      },
      e => {
        if (e) {
          console.error(e);
          return;
        }

        resolve();

        // BrowserFS is initialized and ready-to-use!
      }
    );
  });
}

self.addEventListener('message', async e => {
  const { data } = e;
  if (data.$type === 'worker-manager') {
    if (data.$event === 'init') {
      debug('Initializing BrowserFS');
      await initializeBrowserFS();
      debug('Initialized BrowserFS');

      process.env = data.data.env || {};
      process.env.HOME = '/home';
      BrowserFS.BFSRequire('process').env = data.data.env || {};

      loader()(() => {
        self.require(['vs/workbench/node/extensionHostProcess'], () => {
          self.postMessage({
            $type: 'worker-client',
            $event: 'initialized',
          });
        });
      });
    }
  }
});
