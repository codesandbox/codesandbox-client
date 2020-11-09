import { Profile, Sandbox, UserSandbox } from '@codesandbox/common/lib/types';
import {
  Collection,
  SandboxFragmentDashboardFragment as CollectionSandbox,
} from 'app/graphql/types';
import { RootState } from 'app/overmind';
import { derived } from 'overmind';
import { SandboxType } from 'app/pages/Profile2/constants';

export type ProfileCollection = Pick<
  Collection,
  'id' | 'path' | 'sandboxCount'
> & {
  sandboxes: CollectionSandbox[];
};

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
      all?: Sandbox[];
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
  searchQuery: string | null;
  isLoadingSandboxes: boolean;
  sandboxToDeleteId: string | null;
  current: Profile | null;
  isProfileCurrentUser: boolean;
  showcasedSandbox: Sandbox | null;
  currentSandboxes: { [page: number]: Sandbox[]; all?: Sandbox[] };
  currentLikedSandboxes: { [page: string]: Sandbox[] };
  currentSortBy: 'view_count' | 'inserted_at';
  currentSortDirection: 'asc' | 'desc';
  contextMenu: {
    sandboxId: string | null;
    sandboxType: SandboxType | null;
    position: { x: number; y: number } | null;
  };
  collections: ProfileCollection[];
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
  searchQuery: null,
  isLoadingSandboxes: false,
  sandboxToDeleteId: null,
  currentSortBy: 'view_count',
  currentSortDirection: 'desc',
  contextMenu: { sandboxId: null, sandboxType: null, position: null },
  collections: [],
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
