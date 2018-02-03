import { Controller } from '@cerebral/mobx-state-tree';
import store from './store';

let Devtools = null;

if (process.env.NODE_ENV !== 'production') {
  Devtools = require('cerebral/devtools').default; // eslint-disable-line
}

export default Controller(store, {
  devtools:
    Devtools &&
    Devtools({
      host: 'localhost:8383',
      reconnect: false,
    }),
});
