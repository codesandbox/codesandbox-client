import {
  CurrentUser,
  Notification,
  Sandbox,
  UploadFile,
} from '@codesandbox/common/lib/types';

import { Derive } from '.';
import { hasLogIn } from './utils/user';

type State = {
  isPatron: Derive<State, boolean>;
  isFirstVisit: boolean;
  isLoggedIn: Derive<State, boolean>;
  hasLogIn: boolean;
  popularSandboxes: Sandbox[] | null;
  hasLoadedApp: boolean;
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
};

export const state: State = {
  isFirstVisit: false,
  isPatron: ({ user }) =>
    Boolean(user && user.subscription && user.subscription.since),
  isLoggedIn: ({ user }) => hasLogIn() && Boolean(user),
  hasLogIn: hasLogIn(),
  isContributor: ({ contributors }) => username =>
    contributors.findIndex(
      contributor =>
        contributor.toLocaleLowerCase() === username.toLocaleLowerCase()
    ) > -1,
  popularSandboxes: null,
  hasLoadedApp: false,
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
};
