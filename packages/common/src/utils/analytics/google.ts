import { global } from './utils';

export const track = (_, data) => {
  if (typeof global.ga !== 'undefined') {
    global.ga('send', data);
  }
};
