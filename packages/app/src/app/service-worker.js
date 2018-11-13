/* eslint-env service-worker */
/* global workbox */

console.log('Hello from new service worker v7!');

// workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

const mapping = {};

const handler = ({ url, event }) => {
  const { pathname } = url;

  const r = new Response(`<html><body><h1>${pathname}</h1></body></html>`, {
    headers: { 'Content-Type': 'text/html' },
  });

  return r;
};

workbox.routing.registerRoute(new RegExp('/sw-api/.+'), handler);

self.addEventListener('message', event => {
  const data = event.data;

  if (data.command === 'twoWayCommunication') {
    mapping[data.channel] = event.ports[0];

    event.ports[0].postMessage({
      message: 'Initialized',
    });
  }
});
