import { Controller } from '@cerebral/mobx-state-tree';
import store from './store';

let Devtools = null;

if (
  process.env.NODE_ENV !== 'production' ||
  (typeof window !== 'undefined' &&
    'localStorage' in window &&
    JSON.parse(window.localStorage.getItem('settings.connectDebugger')))
) {
  Devtools = require('cerebral/devtools').default; // eslint-disable-line
}

// preferences.settings.${props`name`}
export default Controller(store, {
  devtools:
    Devtools &&
    Devtools({
      host: 'localhost:8383',
      reconnect: false,
    }),
});
