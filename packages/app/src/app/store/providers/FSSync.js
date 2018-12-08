import { Provider } from 'cerebral';

const fs = BrowserFS.BFSRequire('fs');

const readdir = path =>
  new Promise((resolve, reject) => {
    fs.readdir(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

const stat = path =>
  new Promise((resolve, reject) => {
    fs.stat(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

async function createFileIndex(path, tree) {
  const files = await readdir(path);

  await Promise.all(
    files.map(async file => {
      const fpath = `${path}/${file}`;

      const fstat = await stat(fpath);
      if (fstat.isDirectory()) {
        const child = (tree[file] = {});

        await createFileIndex(fpath, child);
      } else {
        tree[file] = null;
      }
    })
  );
}

export default Provider({
  syncCurrentSandbox(currentId) {
    navigator.serviceWorker.addEventListener('message', async event => {
      if (event.data && event.data.sw) {
        const path = '/sandbox' + event.data.path;
        const cleanPath = path.replace(/\?.*$/, '');

        if (path.endsWith('?meta')) {
          fs.readdir(cleanPath, (error, result) => {
            if (error) {
              event.ports[0].postMessage({
                error,
              });
            } else {
              event.ports[0].postMessage({
                result,
              });
            }
          });
        } else if (path.endsWith('?stat')) {
          fs.stat(cleanPath, (error, result) => {
            if (error) {
              event.ports[0].postMessage({
                error,
              });
            } else {
              event.ports[0].postMessage({
                stats: result.toBuffer().toJSON(),
              });
            }
          });
        } else {
          fs.readFile(cleanPath, (error, content) => {
            if (error) {
              event.ports[0].postMessage({
                error,
              });
            } else {
              fs.stat(cleanPath, (error2, stats) => {
                if (error2) {
                  event.ports[0].postMessage({
                    error: error2,
                  });
                } else {
                  event.ports[0].postMessage({
                    result: content.toJSON(),
                    stats: stats.toBuffer().toJSON(),
                  });
                }
              });
            }
          });
        }
        // event.ports[0].close();
      }
    });
  },
});
