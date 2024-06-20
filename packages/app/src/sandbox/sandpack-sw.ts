console.log('sandpack worker');

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  console.log('WORKER: Fetching', event.request.url);
  //   // @ts-ignore
  //   const req = event.request.clone();
  //   const parsedUrl = new URL(req.url);

  //   console.log(parsedUrl.href);

  //   return;
});
