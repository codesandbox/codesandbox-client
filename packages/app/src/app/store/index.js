import HttpProvider from '@cerebral/http';
import { Module } from 'cerebral';
import { createContext, useContext } from 'react';

import model from './model';
import ApiProvider from './providers/Api';
import ConnectionProvider from './providers/Connection';
import JwtProvider from './providers/Jwt';
import BrowserProvider from './providers/Browser';
import RouterProvider from './providers/Router';
import UtilsProvider from './providers/Utils';
import JSZipProvider from './providers/JSZip';
import SettingsStoreProvider from './providers/SettingsStore';
import GitProvider from './providers/Git';
import SocketProvider from './providers/Socket';
import LiveProvider from './providers/Live';
import NotificationsProvider from './providers/Notifications';
import ModuleRecover from './providers/ModuleRecover';
import OTProvider from './providers/OT';
import KeybindingManagerProvider from './providers/KeybindingManager';
import SSEProvider from './providers/SSE';
import FSSyncProvider from './providers/FSSync';
import CodeSandboxAPIProvider from './providers/CodeSandboxAPI';
import ExecutorProvider from './providers/Executor';

import * as sequences from './sequences';
import * as errors from './errors';
import { isContributor } from './computed';
import { isPatron, isLoggedIn, hasLogIn } from './getters';

import patron from './modules/patron';
import editor from './modules/editor';
import profile from './modules/profile';
import server from './modules/server';
import deployment from './modules/deployment';
import explore from './modules/explore';
import git from './modules/git';
import preferences from './modules/preferences';
import workspace from './modules/workspace';
import files from './modules/files';
import live from './modules/live';
import dashboard from './modules/dashboard';
import userNotifications from './modules/user-notifications';

export const Signals = createContext();
export const Store = createContext();

export const useSignals = () => useContext(Signals);
export const useStore = () => useContext(Store);

export default Module({
  model,
  state: {
    popularSandboxes: null,
    hasLoadedApp: false,
    jwt: null,
    isAuthenticating: true,
    authToken: null,
    error: null,
    user: null,
    connected: true,
    contributors: [],
    userMenuOpen: false,
    isLoadingZeit: false,
    isLoadingCLI: false,
    isLoadingGithub: false,
    contextMenu: {
      show: false,
      items: [],
      x: 0,
      y: 0,
    },
    currentModal: undefined,
    currentModalMessage: undefined,
    uploadedFiles: null,
    maxStorage: 0,
    usedStorage: 0,
    updateStatus: null,
  },
  getters: {
    isPatron,
    isLoggedIn,
    hasLogIn,
  },
  computed: {
    isContributor,
  },
  signals: {
    appUnmounted: sequences.unloadApp,
    searchMounted: sequences.loadSearch,
    sandboxPageMounted: sequences.loadSandboxPage,
    cliMounted: sequences.loadCLI,
    cliInstructionsMounted: sequences.loadCLIInstructions,
    githubPageMounted: sequences.loadGitHubPage,
    connectionChanged: sequences.setConnection,
    modalOpened: sequences.openModal,
    modalClosed: sequences.closeModal,
    signInClicked: sequences.signIn,
    signInCliClicked: sequences.signInCli,
    userMenuOpened: sequences.openUserMenu,
    userMenuClosed: sequences.closeUserMenu,
    notificationAdded: sequences.addNotification,
    notificationRemoved: sequences.removeNotification,
    signInZeitClicked: sequences.signInZeit,
    signOutZeitClicked: sequences.signOutZeit,
    authTokenRequested: sequences.getAuthToken,
    requestAuthorisation: sequences.authorize,
    signInGithubClicked: sequences.signInGithub,
    signOutClicked: sequences.signOut,
    signOutGithubIntegration: sequences.signOutGithubIntegration,
    setUpdateStatus: sequences.setUpdateStatus,
    refetchSandboxInfo: sequences.refetchSandboxInfo,
    track: sequences.track,
  },
  catch: [
    [errors.CancelError, []],
    [errors.AuthenticationError, sequences.showAuthenticationError],
  ],
  modules: {
    dashboard,
    patron,
    editor,
    profile,
    deployment,
    git,
    preferences,
    workspace,
    files,
    live,
    userNotifications,
    server,
    explore,
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
    git: GitProvider,
    keybindingManager: KeybindingManagerProvider,
    socket: SocketProvider,
    notifications: NotificationsProvider,
    live: LiveProvider,
    recover: ModuleRecover,
    ot: OTProvider,
    sse: SSEProvider,
    fsSync: FSSyncProvider,
    executor: ExecutorProvider,
    codeSandboxApi: CodeSandboxAPIProvider,
  },
});
