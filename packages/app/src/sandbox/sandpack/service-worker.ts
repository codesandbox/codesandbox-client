/**
 * This Service Worker captures fetches and will either:
 *
 * - Passthrough (i.e. execute the default behavior of the fetch).
 * - Post message to client.
 *
 * There are some hardcoded paths which passthrough, but it also uses
 * the InactivityTrigger to passthrough a request if it's taken a while
 * for the client to respond. Once a path has been successfully passed through
 * it is remembered as a passthrough.
 *
 * If a path isn't recognized as a passthrough path, then the Service Worker
 * will try to resolve it by posting a MESSAGE_REQUEST event to the client.
 */
import {
  MESSAGE_RESPONSE,
  REQUEST_FLUSH_DELAY,
  REQUEST_FLUSH_INTERVAL,
  PATH_ASSETS_JSON,
  PASSTHROUGH_PATHS,
  SandpackResponsePayload,
  createRequestEvent,
} from './constants';
import { DeferredRequestsCollection } from './deferred-requests';
import { createInactivityTrigger } from './inactivity-trigger';

const HOST = `${location.protocol}//${location.host}`;

const sw: any = self;
const passthroughPaths = new Set(PASSTHROUGH_PATHS);
const requests = new DeferredRequestsCollection();

const passthroughRequestAndSave = (requestId: string) => {
  requests
    .passthrough(requestId)
    .then(({ request, response }) => {
      if (!response.ok) {
        return;
      }

      const path = getPath(request.url);
      passthroughPaths.add(path);
    })
    .catch(() => {
      // Do nothing. Already caught in the deferred requests resolve/reject.
    });
};

const requestFlusher = createInactivityTrigger({
  delay: REQUEST_FLUSH_DELAY,
  interval: REQUEST_FLUSH_INTERVAL,
  cb() {
    Array.from(requests.keys()).forEach(passthroughRequestAndSave);
  },
});

requestFlusher.start();

const getPath = url => `/${url.replace(/^https?:\/\/[^/]+\/?/, '')}`;

const fetchAndUpdatePassthrough = () =>
  fetchWebpackAssets().then(assets => {
    assets.forEach(x => passthroughPaths.add(x));
  });

const fetchWebpackAssets = () =>
  fetch(PATH_ASSETS_JSON)
    .then(x => x.json())
    .then(assets =>
      [].concat(...Object.values(assets).map(entry => Object.values(entry)))
    );

const handleResponse = ({
  requestId,
  content,
  contentType,
  isFile,
}: SandpackResponsePayload) => {
  requestFlusher.notify();

  if (isFile) {
    requests.respond(
      requestId,
      new Response(content, {
        headers: {
          'Content-Type': contentType,
        },
      })
    );
  } else {
    passthroughRequestAndSave(requestId);
  }
};

sw.addEventListener('install', event => {
  sw.skipWaiting();
  event.waitUntil(fetchAndUpdatePassthrough());
});

sw.addEventListener('activate', event => {
  // Start intercepting immediately...
  event.waitUntil(sw.clients.claim());
});

sw.addEventListener('fetch', event => {
  requestFlusher.notify();
  const { request, clientId } = event as { request: Request; clientId: string };

  if (!request.url.startsWith(HOST)) {
    return;
  }

  const path = getPath(request.url);

  if (passthroughPaths.has(path)) {
    return;
  }

  const response = sw.clients.get(clientId).then(
    client =>
      new Promise<Response>((resolve, reject) => {
        const requestId = requests.create({ request, resolve, reject });

        if (client) {
          client.postMessage(createRequestEvent({ path, requestId }));
        }
      })
  );

  event.respondWith(response);
});

sw.addEventListener('message', event => {
  const { type, payload } = event.data || {};

  if (type === MESSAGE_RESPONSE) {
    handleResponse(payload);
  }
});
