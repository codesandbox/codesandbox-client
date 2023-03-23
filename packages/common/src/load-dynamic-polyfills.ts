export default function requirePolyfills() {
  const promises = [];

  if (typeof Error.captureStackTrace === 'undefined') {
    promises.push(
      import(/* webpackChunkName: 'error-polyfill' */ 'error-polyfill')
    );
  }

  return Promise.all(promises);
}
