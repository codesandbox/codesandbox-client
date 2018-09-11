import loader from '../../dev-bootstrap';

async function initializeBrowserFS() {
  return new Promise(resolve => {
    BrowserFS.configure(
      {
        fs: 'AsyncMirror',
        options: {
          sync: { fs: 'InMemory' },
          async: {
            fs: 'IndexedDB',
            options: {
              storeName: 'VSCode',
            },
          },
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

      console.log(data.data.env);

      loader()(() => {
        self.require(['vs/bootstrap'], () => {
          self.postMessage({
            $type: 'worker-client',
            $event: 'initialized',
          });
        });
      });
    }
  }
});
