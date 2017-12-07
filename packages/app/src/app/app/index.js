import { Module } from 'cerebral';
import HttpProvider from '@cerebral/http';

import model from './model';
import ApiProvider from './providers/Api';
import ConnectionProvider from './providers/Connection';
import JwtProvider from './providers/Jwt';
import BrowserProvider from './providers/Browser';
import * as sequences from './sequences';
import * as errors from './errors';
import { subscribed, isLoggedIn } from './getters';

import patron from './modules/patron';
import editor from './modules/editor';

export default Module({
  model,
  state: {
    jwt: null,
    user: {
      id: null,
      email: null,
      name: null,
      username: null,
      avatarUrl: null,
      jwt: null,
      subscription: null,
      badges: [],
      integrations: {
        zeit: null,
        github: null,
      },
    },
    connected: true,
    notifications: [],
  },
  getters: {
    subscribed,
    isLoggedIn,
  },
  signals: {
    appMounted: sequences.loadApp,
    appUnmounted: sequences.unloadApp,
    connectionChanged: sequences.setConnection,
  },
  catch: [[errors.AuthenticationError, sequences.showAuthenticationError]],
  modules: {
    patron,
    editor,
  },
  providers: {
    api: ApiProvider,
    connection: ConnectionProvider,
    jwt: JwtProvider,
    http: HttpProvider(),
    browser: BrowserProvider,
  },
});
