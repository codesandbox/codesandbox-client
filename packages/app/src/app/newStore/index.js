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
import SettingsStoreProvider from './providers/SettingsStore';

import * as sequences from './sequences';
import * as errors from './errors';
import { isPatron, isLoggedIn } from './getters';

import patron from './modules/patron';
import editor from './modules/editor';
import profile from './modules/profile';

export default Module({
  model,
  state: {
    jwt: null,
    isAuthenticating: true,
    authToken: null,
    error: null,
    user: {
      id: null,
      email: null,
      name: null,
      username: null,
      avatarUrl: null,
      badges: [],
      integrations: {
        zeit: null,
        github: null,
      },
    },
    connected: true,
    notifications: [],
    currentModal: null,
    userMenuOpen: false,
    isLoadingZeit: false,
    isLoadingCLI: false,
    isLoadingGithub: false,
    zeitInfo: null,
    githubInfo: null,
    contextMenu: {
      show: false,
      items: [],
      x: 0,
      y: 0,
    },
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
    toggleUserMenuClicked: sequences.toggleUserMenu,
    notificationRemoved: sequences.removeNotification,
    signInZeitClicked: sequences.signInZeit,
    signOutZeitClicked: sequences.signOutZeit,
    authTokenRequested: sequences.getAuthToken,
    requestAuthorisation: sequences.authorise,
    signInGithubClicked: sequences.signInGithub,
    signOutGithubClicked: sequences.signOutGithub,
  },
  catch: [[errors.AuthenticationError, sequences.showAuthenticationError]],
  modules: {
    patron,
    editor,
    profile,
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
    settingsStore: SettingsStoreProvider,
  },
});
