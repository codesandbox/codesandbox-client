// import extensionsBuffer from 'buffer-loader!vscode/extensions-bundle/extensions.zip';

export const BROWSER_FS_CONFIG = {
  fs: 'MountableFileSystem',
  options: {
    '/': { fs: 'InMemory', options: {} },
    '/tmp': { fs: 'InMemory', options: {} },
    '/worker': { fs: 'WorkerFS', options: { worker: self } },
    '/sandbox': {
      fs: 'InMemory',
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
};

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

      fs.writeFile(target, str, () => {
        resolve();
      });
    });
  });
}

function syncDirectory(
  fs,
  path: string,
  target: string,
  { ignoreDirs = [] } = {}
) {
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
              if (ignoreDirs.indexOf(entry) > -1) {
                r();
                return;
              }

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

export async function initializeBrowserFS({ syncSandbox = false } = {}) {
  const config = { ...BROWSER_FS_CONFIG };

  if (syncSandbox) {
    let modulesByPath = {};

    config.options['/sandbox'] = {
      fs: 'CodeSandboxEditorFS',
      options: {
        api: {
          getState: () => ({
            modulesByPath,
          }),
        },
      },
    };

    self.addEventListener('message', evt => {
      if (evt.data.$type === 'file-sync') {
        modulesByPath = evt.data.$data;
      }
    });
  }

  return new Promise(resolve => {
    BrowserFS.configure(config, async e => {
      if (e) {
        console.error(e);
        return;
      }

      resolve();

      // BrowserFS is initialized and ready-to-use!
    });
  });
}
