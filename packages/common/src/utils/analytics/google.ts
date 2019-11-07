import { global } from './utils';

export const track = (_, data) => {
  if (typeof global.ga !== 'undefined') {
    global.ga('send', data);
  }
};

export const trackPageView = () => {
  if (typeof global.ga !== 'undefined') {
    global.ga('set', 'page', location.pathname + location.search);
  }
};
