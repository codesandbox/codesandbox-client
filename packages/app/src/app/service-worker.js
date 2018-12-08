/* eslint-env service-worker */
/* global workbox, BrowserFS */

console.log('Hello from new service worker v37!');

self.importScripts(`/static/browserfs2/browserfs.min.js`);

let fs;

BrowserFS.configure(
  {
    fs: 'IndexedDB',
    options: {
      storeName: 'SandboxData',
    },
  },
  err => {
    if (err) {
      throw err;
    }

    fs = BrowserFS.BFSRequire('fs');
  }
);

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

// workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

const mapping = {};

const ROOT_URL = '/sw-api';

const handler = ({ url }) => {
  const { pathname } = url;

  const pathToFile = pathname.replace(ROOT_URL, '');

  return new Promise((resolve, reject) => {
    if (!fs) {
      reject('FS is not initialized');
      return;
    }

    if (pathToFile.endsWith('index.json')) {
      const pathParts = pathToFile.split('/');
      pathParts.pop();
      const dirname = pathParts.join('/');

      const files = {};
      resolve(
        createFileIndex(dirname, files).then(
          () => new Response(JSON.stringify(files))
        )
      );
      return;
    }

    fs.readFile(pathToFile, {}, (err, data) => {
      if (err) {
        reject(err.message);
        return;
      }

      resolve(new Response(data));
    });
  });
};

self.addEventListener('fetch', event => {
  if (event.request) {
    const path = event.request.url.replace('http://localhost:3000', '');
    if (path.startsWith(ROOT_URL)) {
      const fpath = path.replace(ROOT_URL, '');

      const clientId = event.clientId;

      return event.respondWith(
        new Promise(resolve => {
          self.clients.get(clientId).then(client => {
            if (client) {
              const messageChannel = new MessageChannel();
              messageChannel.port1.onmessage = event => {
                messageChannel.port1.close();

                resolve(new Response(JSON.stringify(event.data)));
              };

              client.postMessage({ sw: true, path: fpath }, [
                messageChannel.port2,
              ]);
            }
          });
        })
      );
    }
  }
});

// workbox.routing.registerRoute(new RegExp(`${ROOT_URL}/.+`), handler);
