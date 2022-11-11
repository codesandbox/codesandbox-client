import {
  CurrentUser,
  Notification,
  Sandbox,
  UploadFile,
} from '@codesandbox/common/lib/types';
import {
  CurrentTeamInfoFragmentFragment as CurrentTeam,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { derived } from 'overmind';
import { hasLogIn } from '@codesandbox/common/lib/utils/user';

export type PendingUserType = {
  avatarUrl: string | null;
  username: string;
  name: string | null;
  id: string;
  valid?: boolean;
} | null;

type State = {
  isPatron: boolean;
  isFirstVisit: boolean;
  isLoggedIn: boolean;
  hasLogIn: boolean;
  popularSandboxes: Sandbox[] | null;
  hasLoadedApp: boolean;
  isAuthenticating: boolean;
  authToken: string | null;
  isLoadingAuthToken: boolean;
  error: string | null;
  contributors: string[];
  user: CurrentUser | null;
  activeWorkspaceAuthorization: TeamMemberAuthorization;
  personalWorkspaceId: string | null;
  activeTeam: string | null;
  activeTeamInfo: CurrentTeam | null;
  connected: boolean;
  notifications: Notification[];
  isLoadingCLI: boolean;
  isLoadingGithub: boolean;
  isLoadingVercel: boolean;
  pendingUserId: string | null;
  pendingUser: PendingUserType;
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
  cancelOnLogin: null | (() => void);
  duplicateAccountStatus: {
    duplicate: boolean;
    provider: 'apple' | 'google' | 'github';
  } | null;
  loadingAuth: {
    apple: boolean;
    google: boolean;
    github: boolean;
  };
  /**
   * Limits used for anonymous users and keeping track of their
   * anonymous sandboxes
   */
  sandboxesLimits?: {
    sandboxCount: number;
    sandboxLimit: number;
  } | null;
};

export const state: State = {
  pendingUserId: null,
  pendingUser: null,
  isFirstVisit: false,
  /**
   * Important, only use this to see if someone has patron, you should not check this to see if someone
   * has pro.
   */
  isPatron: derived(({ user }: State) =>
    Boolean(user && user.subscription && user.subscription.since)
  ),
  isLoggedIn: derived(({ hasLogIn: has, user }: State) => has && Boolean(user)),
  // TODO: Should not reference store directly here, rather initialize
  // the state with "onInitialize" setting the jwt
  hasLogIn: hasLogIn(),
  isContributor: derived(({ contributors }: State) => username =>
    contributors.findIndex(
      contributor =>
        contributor.toLocaleLowerCase() === username.toLocaleLowerCase()
    ) > -1
  ),
  popularSandboxes: null,
  hasLoadedApp: false,
  isAuthenticating: true,
  authToken: null,
  isLoadingAuthToken: false,
  error: null,
  user: null,
  activeWorkspaceAuthorization: derived(
    ({ user, activeTeam, activeTeamInfo }: State) => {
      if (!activeTeam || !activeTeamInfo || !user)
        return TeamMemberAuthorization.Admin;

      return activeTeamInfo.userAuthorizations.find(
        auth => auth.userId === user.id
      )!.authorization;
    }
  ),
  activeTeam: null,
  activeTeamInfo: null,
  personalWorkspaceId: null,
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
  cancelOnLogin: null,
  duplicateAccountStatus: null,
  loadingAuth: {
    apple: false,
    google: false,
    github: false,
  },
};
