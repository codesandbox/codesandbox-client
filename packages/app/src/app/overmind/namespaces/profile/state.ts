import { Sandbox, UserSandbox, Profile } from '@codesandbox/common/lib/types';
import { Derive } from 'app/overmind';

type State = {
  /**
   * A hash of all previously loaded profiles
   */
  profiles: {
    [profileId: string]: Profile;
  };
  /**
   * Used to retrieve a previously loaded profile, is
   * automatically set to the last profile which was loaded
   * upon navigating to the profiles route
   */
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
  isProfileCurrentUser: ({ currentProfileId }, { user }) =>
    user?.id === currentProfileId,
  current: ({ profiles, currentProfileId }) => profiles[currentProfileId],
  showcasedSandbox: ({ current }, { editor }) =>
    current?.featuredSandbox && editor.sandboxes[current.featuredSandbox],
  currentLikedSandboxes: ({ current, likedSandboxes }) =>
    current && likedSandboxes[current.username],
  currentSandboxes: ({ current, sandboxes }) =>
    current && sandboxes[current.username],
};
