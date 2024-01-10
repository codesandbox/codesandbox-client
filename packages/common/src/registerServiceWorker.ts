// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const isHttp = Boolean(window.location.protocol === 'http:');

interface SWOptions {
  onUpdated?: () => void;
  onInstalled?: () => void;
}

export default function register(swUrl, opts: SWOptions = {}) {
  if ('serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    // @ts-ignore
    const publicUrl = new URL(process.env.PUBLIC_URL || '/', window.location);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
      return;
    }

    // window.addEventListener('load', () => {
    if (!isLocalhost && !isHttp) {
      // It's neither localhost nor http. Just register service worker
      registerValidSW(swUrl, opts);
    } else if (isLocalhost) {
      // This is running on localhost. Lets check if a service worker still exists or not.
      checkValidServiceWorker(swUrl, opts);
    }
  }
}

function registerValidSW(
  swUrl: string,
  { onUpdated, onInstalled }: SWOptions = {}
) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and
              // the fresh content will have been added to the cache.
              // It's the perfect time to display a "New content is
              // available; please refresh." message in your web app.
              if (onUpdated) {
                onUpdated();
              }
            } else if (onInstalled) {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.

              onInstalled();
            }
          } else if (installingWorker.state === 'redundant') {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
              navigator.storage.estimate().then(results => {
                const percentUsed = results.usage / results.quota;
                // Let's assume that if we're using 95% of our quota, then this failure
                // was due to quota exceeded errors.
                // TODO: Hardcoding a threshold stinks.
                if (percentUsed >= 0.95) {
                  // Get rid of the existing SW so that we're not stuck
                  // with the previously cached content.
                  registration.unregister();

                  // Let's assume that we have some way of doing this without inadvertantly
                  // blowing away storage being used on the origin by something other than
                  // our service worker.
                  // I don't think that the Clear-Site-Data: header helps here, unfortunately.
                  self.caches.keys().then(names => {
                    names.forEach(name => {
                      self.caches.delete(name);
                    });
                  });

                  // TODO clear indexeddb
                }
              });
            } else {
              // What about browsers that don't support navigator.storage.estimate()?
              // There's no way of guessing why the service worker is redundant.
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, { onUpdated, onInstalled }: SWOptions) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, { onUpdated, onInstalled });
      }
    })
    .catch(e => {
      // eslint-disable-next-line no-console
      console.log(
        'No internet connection found. App is running in offline mode.',
        e
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
