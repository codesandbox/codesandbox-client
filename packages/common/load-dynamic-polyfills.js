function detectIE() {
  const ua = window.navigator.userAgent;

  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  // other browser
  return false;
}

function detectOpera() {
  return navigator.userAgent.indexOf('Opera') > -1;
}

export default function requirePolyfills() {
  const promises = [];

  if (detectIE() || detectOpera()) {
    promises.push(import(/* webpackChunkName: 'polyfills' */ 'babel-polyfill'));
  }

  if (typeof Error.captureStackTrace === 'undefined') {
    promises.push(
      /* webpackChunkName: 'error-polyfill' */
      import('error-polyfill')
    );
  }

  return Promise.all(promises);
}
