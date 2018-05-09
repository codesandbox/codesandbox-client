import detectOldBrowser from 'common/detect-old-browser';

exports.onClientEntry = () => {
  if (detectOldBrowser()) {
    require('babel-polyfill');
  }
};
