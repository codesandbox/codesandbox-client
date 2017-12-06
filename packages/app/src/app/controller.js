import { Controller } from '@cerebral/mobx-state-tree';
import app from './app';

let Devtools = null;

if (process.env.NODE_ENV !== 'production') {
  Devtools = require('cerebral/devtools').default;
}

export default Controller(app, {
  devtools: Devtools({
    host: 'localhost:8383',
  }),
});
