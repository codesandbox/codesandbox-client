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
  isProfileCurrentUser: (state, rootState) => {
    return rootState.user && rootState.user.id === state.currentProfileId;
  },
  current: state => {
    return state.profiles[state.currentProfileId];
  },
  showcasedSandbox: (state, rootState) => {
    return (
      state.current &&
      state.current.showcasedSandboxShortid &&
      rootState.editor.sandboxes[state.current.showcasedSandboxShortid]
    );
  },
  currentLikedSandboxes: state => {
    return state.current && state.likedSandboxes[state.current.username];
  },
  currentSandboxes: state => {
    return state.current && state.sandboxes[state.current.username];
  },
};
