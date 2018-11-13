import loader from '../dev-bootstrap';
// import tsServerExtension from 'buffer-loader!vscode/extensions/styled-components.zip';

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
          '/sandbox': { fs: 'InMemory', options: {} },
          '/vscode': {
            fs: 'InMemory',
            options: {},
          },
          // '/extensions': {
          //   fs: 'ZipFS',
          //   options: {
          //     zipData: tsServerExtension,
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

        const fs = BrowserFS.BFSRequire('fs');

        resolve(
          syncDirectory(fs, '/worker/sandbox', '/sandbox')
            .then(() => syncDirectory(fs, '/worker/worker/sandbox', '/sandbox'))
            .then(() =>
              syncDirectory(fs, '/worker/worker/worker/sandbox', '/sandbox')
            )
        );

        // BrowserFS is initialized and ready-to-use!
      }
    );
  });
}

self.addEventListener('message', async e => {
  const { data } = e;
  if (data.$type === 'worker-manager') {
    if (data.$event === 'init') {
      await initializeBrowserFS();

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
