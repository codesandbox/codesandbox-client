import {
  CurrentUser,
  Notification,
  Sandbox,
  UploadFile,
} from '@codesandbox/common/lib/types';
import { derived } from 'overmind';
import store from 'store/dist/store.modern';

type State = {
  isPatron: boolean;
  isFirstVisit: boolean;
  isLoggedIn: boolean;
  hasLogIn: boolean;
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
  isLoadingVercel: boolean;
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
  isContributor: (username: String) => boolean;
  signInModalOpen: boolean;
  redirectOnLogin: string | null;
};

export const state: State = {
  isFirstVisit: false,
  isPatron: derived(({ user }: State) =>
    Boolean(user && user.subscription && user.subscription.since)
  ),
  isLoggedIn: derived(({ jwt, user }: State) => Boolean(jwt) && Boolean(user)),
  // TODO: Should not reference store directly here, rather initialize
  // the state with "onInitialize" setting the jwt
  hasLogIn: derived(({ jwt }: State) => !!jwt || !!store.get('jwt')),
  isContributor: derived(({ contributors }: State) => username =>
    contributors.findIndex(
      contributor =>
        contributor.toLocaleLowerCase() === username.toLocaleLowerCase()
    ) > -1
  ),
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
  isLoadingVercel: false,
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
