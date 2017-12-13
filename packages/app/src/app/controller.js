import { Controller } from '@cerebral/mobx-state-tree';
import newStore from './newStore';

let Devtools = null;

if (process.env.NODE_ENV !== 'production' || process.env.STAGING) {
  Devtools = require('cerebral/devtools').default;
}

export default Controller(newStore, {
  devtools:
    Devtools &&
    Devtools({
      host: 'localhost:8383',
      reconnect: false
    }),
});
