import detectOldBrowser from 'common/detect-old-browser';

export const onClientEntry = () => {
  if (detectOldBrowser()) {
    require('babel-polyfill');
  }
};
