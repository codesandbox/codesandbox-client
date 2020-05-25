import { Profile, Sandbox, UserSandbox } from '@codesandbox/common/lib/types';
import { RootState } from 'app/overmind';
import { derived } from 'overmind';

type State = {
  profiles: {
    [profileId: string]: Profile;
  };
  currentProfileId: string | null;
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
  sandboxToDeleteId: string | null;
  current: Profile | null;
  isProfileCurrentUser: boolean;
  showcasedSandbox: Sandbox | null;
  currentSandboxes: { [page: string]: Sandbox[] };
  currentLikedSandboxes: { [page: string]: Sandbox[] };
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
  isProfileCurrentUser: derived((currentState: State, rootState: RootState) =>
    Boolean(
      rootState.user && rootState.user.id === currentState.currentProfileId
    )
  ),
  current: derived((currentState: State) =>
    currentState.currentProfileId
      ? currentState.profiles[currentState.currentProfileId]
      : null
  ),
  showcasedSandbox: derived((currentState: State, rootState: RootState) =>
    currentState.current && currentState.current.showcasedSandboxShortid
      ? rootState.editor.sandboxes[currentState.current.showcasedSandboxShortid]
      : null
  ),
  currentLikedSandboxes: derived((currentState: State) =>
    currentState.current
      ? currentState.likedSandboxes[currentState.current.username]
      : []
  ),
  currentSandboxes: derived((currentState: State) =>
    currentState.current
      ? currentState.sandboxes[currentState.current.username]
      : []
  ),
};
