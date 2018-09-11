import loader from '../dev-bootstrap';
import tsServerExtension from 'buffer-loader!vscode/extensions/typescript-language-features.zip';

async function initializeBrowserFS() {
  return new Promise(resolve => {
    BrowserFS.configure(
      {
        fs: 'MountableFileSystem',
        options: {
          '/': { fs: 'InMemory', options: {} },
          '/sandbox': { fs: 'InMemory', options: {} },
          '/vscode': {
            fs: 'IndexedDB',
            options: {
              storeName: 'VSCode',
            },
          },
          '/extensions': {
            fs: 'ZipFS',
            options: {
              zipData: self.Buffer.from(tsServerExtension),
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
      await initializeBrowserFS();

      process.env = data.data.env || {};
      BrowserFS.BFSRequire('process').env = data.data.env || {};

      loader()(() => {
        console.log('test');
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
