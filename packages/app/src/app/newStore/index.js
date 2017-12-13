import { Module } from 'cerebral';
import HttpProvider from '@cerebral/http';

import model from './model';
import ApiProvider from './providers/Api';
import ConnectionProvider from './providers/Connection';
import JwtProvider from './providers/Jwt';
import BrowserProvider from './providers/Browser';
import RouterProvider from './providers/Router';
import UtilsProvider from './providers/Utils';
import JSZipProvider from './providers/JSZip';

import * as sequences from './sequences';
import * as errors from './errors';
import { isPatron, isLoggedIn } from './getters';

import patron from './modules/patron';
import editor from './modules/editor';

export default Module({
  model,
  state: {
    jwt: null,
    isAuthenticating: false,
    user: {
      id: null,
      email: null,
      name: null,
      username: null,
      avatarUrl: null,
      jwt: null,
      badges: [],
      integrations: {
        zeit: null,
        github: null,
      },
    },
    connected: true,
    notifications: [],
    currentModal: null,
  },
  getters: {
    isPatron,
    isLoggedIn,
  },
  signals: {
    appMounted: sequences.loadApp,
    appUnmounted: sequences.unloadApp,
    connectionChanged: sequences.setConnection,
    modalOpened: sequences.openModal,
    modalClosed: sequences.closeModal,
    signInClicked: sequences.signIn,
    notificationRemoved: sequences.removeNotification,
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
    jsZip: JSZipProvider,
    http: HttpProvider(),
    browser: BrowserProvider,
    router: RouterProvider,
    utils: UtilsProvider,
  },
});
