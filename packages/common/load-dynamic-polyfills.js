import detectOldBrowser from 'common/detect-old-browser';

export default function requirePolyfills() {
  const promises = [];
  if (detectOldBrowser()) {
    promises.push(
      import(/* webpackChunkName: 'polyfills' */ '@babel/polyfill')
    );
  }

  if (typeof Error.captureStackTrace === 'undefined') {
    promises.push(
      import(/* webpackChunkName: 'error-polyfill' */
      'error-polyfill')
    );
  }

  return Promise.all(promises);
}
