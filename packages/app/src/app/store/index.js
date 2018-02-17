import { Module } from '@cerebral/fluent';
import HttpProvider from '@cerebral/http';

import ApiProvider from './providers/Api';
import ConnectionProvider from './providers/Connection';
import JwtProvider from './providers/Jwt';
import BrowserProvider from './providers/Browser';
import RouterProvider from './providers/Router';
import UtilsProvider from './providers/Utils';
import JSZipProvider from './providers/JSZip';
import SettingsStoreProvider from './providers/SettingsStore';
import GitProvider from './providers/Git';
import LiveProvider from './providers/Live';
import OTProvider from './providers/OT';
import KeybindingManagerProvider from './providers/KeybindingManager';

import * as sequences from './sequences';
import * as errors from './errors';
<<<<<<< HEAD
import { isPatron, isLoggedIn, hasLogIn } from './getters';
=======
import * as getters from './getters';
>>>>>>> Initial refactor

import patron from './modules/patron';
import editor from './modules/editor';
import profile from './modules/profile';
import deployment from './modules/deployment';
import git from './modules/git';
import preferences from './modules/preferences';
import workspace from './modules/workspace';
import files from './modules/files';
import live from './modules/live';

export default Module({
<<<<<<< HEAD
    state: {
        hasLoadedApp: false,
        jwt: null,
        isAuthenticating: true,
        authToken: null,
        error: null,
        user: null,
        connected: true,
        notifications: [],
        userMenuOpen: false,
        isLoadingZeit: false,
        isLoadingCLI: false,
        isLoadingGithub: false,
        contextMenu: {
            show: false,
            items: [],
            x: 0,
            y: 0
        },
        currentModal: null
    },
    getters: {
        isPatron,
        isLoggedIn,
        hasLogIn
    },
    signals: {
        appUnmounted: sequences.unloadApp,
        searchMounted: sequences.loadSearch,
        termsMounted: sequences.loadTerms,
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
        signOutGithubIntegration: sequences.signOutGithubIntegration
    },
    catch: [ [ errors.AuthenticationError, sequences.showAuthenticationError ] ],
    modules: {
        patron,
        editor,
        profile,
        deployment,
        git,
        preferences,
        workspace,
        files,
        live
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
        live: LiveProvider,
        ot: OTProvider
    }
=======
  state: {
    hasLoadedApp: false,
    jwt: null,
    isAuthenticating: true,
    authToken: null,
    error: null,
    user: null,
    connected: true,
    notifications: [],
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
    currentModal: null,
    get isPatron() {
      return getters.isPatron(this);
    },
    get isLoggedIn() {
      return getters.isLoggedIn(this);
    },
  },
  signals: {
    appUnmounted: sequences.unloadApp,
    searchMounted: sequences.loadSearch,
    termsMounted: sequences.loadTerms,
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
  },
  catch: [[errors.AuthenticationError, sequences.showAuthenticationError]],
  modules: {
    patron,
    editor,
    profile,
    deployment,
    git,
    preferences,
    workspace,
    files,
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
  },
>>>>>>> Initial refactor
});
