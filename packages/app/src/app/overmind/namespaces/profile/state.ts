import { Sandbox, UserSandbox, Profile } from '@codesandbox/common/lib/types';
import { Derive } from 'app/overmind';

type State = {
  profiles: {
    [profileId: string]: Profile;
  };
  currentProfileId: string;
  notFound: boolean;
  isLoadingProfile: boolean;
  sandboxes: {
    [username: string]: {
      [page: number]: Sandbox[];
    };
  };
  likedSandboxes: {
    [username: string]: {
      [page: number]: Sandbox[];
    };
  };
  userSandboxes: UserSandbox[];
  currentSandboxesPage: number;
  showSelectSandboxModal: boolean;
  currentLikedSandboxesPage: number;
  isLoadingSandboxes: boolean;
  sandboxToDeleteId: string;
  current: Derive<State, Profile>;
  isProfileCurrentUser: Derive<State, boolean>;
  showcasedSandbox: Derive<State, Sandbox>;
  currentSandboxes: Derive<State, { [page: string]: Sandbox[] }>;
  currentLikedSandboxes: Derive<State, { [page: string]: Sandbox[] }>;
};

export const state: State = {
  profiles: {},
  currentProfileId: null,
  showSelectSandboxModal: false,
  notFound: false,
  isLoadingProfile: true,
  sandboxes: {},
  likedSandboxes: {},
  userSandboxes: [],
  currentSandboxesPage: 1,
  currentLikedSandboxesPage: 1,
  isLoadingSandboxes: false,
  sandboxToDeleteId: null,
  isProfileCurrentUser: (currentState, rootState) =>
    rootState.user && rootState.user.id === currentState.currentProfileId,
  current: currentState => currentState.profiles[currentState.currentProfileId],
  showcasedSandbox: (currentState, rootState) =>
    currentState.current &&
    currentState.current.showcasedSandboxShortid &&
    rootState.editor.sandboxes[currentState.current.showcasedSandboxShortid],
  currentLikedSandboxes: currentState =>
    currentState.current &&
    currentState.likedSandboxes[currentState.current.username],
  currentSandboxes: currentState =>
    currentState.current &&
    currentState.sandboxes[currentState.current.username],
};
