import {
  CurrentUser,
  Notification,
  Sandbox,
  UploadFile,
} from '@codesandbox/common/lib/types';
import store from 'store/dist/store.modern';

import { Derive } from '.';

type State = {
  isPatron: Derive<State, boolean>;
  isFirstVisit: boolean;
  isLoggedIn: Derive<State, boolean>;
  hasLogIn: Derive<State, boolean>;
  popularSandboxes: Sandbox[] | null;
  hasLoadedApp: boolean;
  jwt: string | null;
  isAuthenticating: boolean;
  authToken: string | null;
  error: string | null;
  contributors: string[];
  user: CurrentUser | null;
  connected: boolean;
  notifications: Notification[];
  isLoadingCLI: boolean;
  isLoadingGithub: boolean;
  isLoadingZeit: boolean;
  contextMenu: {
    show: boolean;
    items: string[];
    x: number;
    y: number;
  };
  currentModal: string | null;
  currentModalMessage: string | null;
  uploadedFiles: UploadFile[] | null;
  maxStorage: number;
  usedStorage: number;
  updateStatus: string | null;
  isContributor: Derive<State, (username: String) => boolean>;
  signInModalOpen: boolean;
  redirectOnLogin: string | null;
};

export const state: State = {
  isFirstVisit: false,
  isPatron: ({ user }) =>
    Boolean(user && user.subscription && user.subscription.since),
  isLoggedIn: ({ jwt, user }) => Boolean(jwt) && Boolean(user),
  // TODO: Should not reference store directly here, rather initialize
  // the state with "onInitialize" setting the jwt
  hasLogIn: ({ jwt }) => !!jwt || !!store.get('jwt'),
  isContributor: ({ contributors }) => username =>
    contributors.findIndex(
      contributor =>
        contributor.toLocaleLowerCase() === username.toLocaleLowerCase()
    ) > -1,
  popularSandboxes: null,
  hasLoadedApp: false,
  jwt: null,
  isAuthenticating: true,
  authToken: null,
  error: null,
  user: null,
  connected: true,
  notifications: [],
  contributors: [],
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
  currentModalMessage: null,
  uploadedFiles: null,
  maxStorage: 0,
  usedStorage: 0,
  updateStatus: null,
  signInModalOpen: false,
  redirectOnLogin: null,
};
