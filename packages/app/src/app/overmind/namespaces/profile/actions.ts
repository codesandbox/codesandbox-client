import { Sandbox, Profile } from '@codesandbox/common/lib/types';
import { Context } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { SandboxType } from 'app/pages/Profile/constants';

export const profileMounted = withLoadApp(
  async ({ effects, state }: Context, username: string) => {
    state.profile.isLoadingProfile = true;
    state.profile.notFound = false;

    let profile: Profile;

    try {
      profile = await effects.api.getProfile(username);
    } catch (error) {
      state.profile.isLoadingProfile = false;
      state.profile.notFound = true;
      return;
    }

    state.profile.profiles[profile.id] = profile;
    state.profile.currentProfileId = profile.id;

    if (profile.showcasedSandboxShortid) {
      try {
        state.profile.showcasedSandbox = await effects.api.getSandbox(
          profile.showcasedSandboxShortid
        );
      } catch (e) {
        // Ignore it
      }
    }

    state.profile.isLoadingProfile = false;
  }
);

export const fetchSandboxes = async ({ effects, state }: Context) => {
  if (!state.profile.current) return;

  state.profile.isLoadingSandboxes = true;

  const { username } = state.profile.current;
  const {
    currentSandboxesPage: page,
    currentSortBy: sortBy,
    currentSortDirection: direction,
  } = state.profile;

  const data = await effects.api.getUserSandboxes(
    username,
    page,
    sortBy,
    direction
  );

  if (!state.profile.sandboxes[username]) {
    state.profile.sandboxes[username] = {};
  }

  state.profile.sandboxes[username][page] = data[page];
  state.profile.isLoadingSandboxes = false;
};

export const sandboxesPageChanged = (
  { state, actions }: Context,
  page: number
) => {
  state.profile.currentSandboxesPage = page;
  actions.profile.fetchSandboxes();
};

export const sortByChanged = (
  { state, actions }: Context,
  sortBy: 'view_count' | 'inserted_at'
) => {
  state.profile.currentSortBy = sortBy;
  state.profile.currentSandboxesPage = 1;
  actions.profile.fetchSandboxes();
};

export const sortDirectionChanged = (
  { state, actions }: Context,
  direction: 'asc' | 'desc'
) => {
  state.profile.currentSortDirection = direction;
  state.profile.currentSandboxesPage = 1;
  actions.profile.fetchSandboxes();
};

export const likedSandboxesPageChanged = async (
  { effects, state }: Context,
  page: number
) => {
  state.profile.isLoadingSandboxes = true;
  state.profile.currentLikedSandboxesPage = page;

  if (!state.profile.current) {
    return;
  }

  const { username } = state.profile.current;

  if (
    !state.profile.likedSandboxes[username] ||
    !state.profile.likedSandboxes[username][page]
  ) {
    const data = await effects.api.getUserLikedSandboxes(username, page);
    const sandboxes = data[page];

    if (!state.profile.likedSandboxes[username]) {
      state.profile.likedSandboxes[username] = {};
    }

    state.profile.likedSandboxes[username][page] = sandboxes;
  }

  state.profile.isLoadingSandboxes = false;
};

export const selectSandboxClicked = async ({ state, effects }: Context) => {
  state.currentModal = 'selectSandbox';

  if (!state.profile.userSandboxes.length) {
    state.profile.isLoadingSandboxes = true;
    state.profile.userSandboxes = await effects.api.getSandboxes();
    state.profile.isLoadingSandboxes = false;
  }
};

export const newSandboxShowcaseSelected = async (
  { state, effects }: Context,
  id: string
) => {
  state.currentModal = null;

  if (!state.profile.currentProfileId) {
    return;
  }

  state.profile.profiles[
    state.profile.currentProfileId
  ].showcasedSandboxShortid = id;
  state.profile.isLoadingProfile = true;

  if (!state.user) {
    return;
  }

  const sandbox = await effects.api.updateShowcasedSandbox(
    state.user.username,
    id
  );
  state.profile.showcasedSandbox = sandbox as Sandbox;
  state.profile.isLoadingProfile = false;
};

export const deleteSandboxClicked = ({ state }: Context, id: string) => {
  state.profile.sandboxToDeleteId = id;
  state.currentModal = 'deleteProfileSandbox';
};

export const deleteSandboxInState = ({ state }: Context, id: Sandbox['id']) => {
  if (!state.profile.current) return;

  const username = state.profile.current.username;
  const page = state.profile.currentSandboxesPage;
  const sandboxes = state.profile.sandboxes[username][page];

  state.profile.sandboxes[username][page] = sandboxes.filter(
    sandbox => sandbox.id !== id
  );
  state.profile.current.sandboxCount--;

  // for picker
  state.profile.collections = state.profile.collections.map(collection => ({
    ...collection,
    sandboxes: collection.sandboxes.filter(sandbox => sandbox.id !== id),
  }));
};

export const sandboxDeleted = async ({ state, effects, actions }: Context) => {
  state.currentModal = null;

  const sandboxId = state.profile.sandboxToDeleteId;

  if (!sandboxId || !state.profile.current || !state.user) {
    return;
  }

  // optimisitc update
  actions.profile.deleteSandboxInState(sandboxId);

  try {
    await effects.api.deleteSandbox(sandboxId);
  } catch (error) {
    // oops! refetch sandboxes from api
    actions.profile.fetchSandboxes();
    state.profile.current.sandboxCount++;
    effects.notificationToast.error(
      'There was a problem deleting your sandbox'
    );
  }
};

export const validateUsernameUpdate = async (
  { effects, state }: Context,
  userName: string
) => {
  if (!state.profile) return;
  const validity = await effects.api.validateUsername(userName);
  // eslint-disable-next-line consistent-return
  return validity.available;
};

export const updateUserProfile = async (
  { state, actions, effects }: Context,
  {
    username,
    name,
    bio,
    socialLinks,
    onCancel,
  }: {
    username: string;
    name: string;
    bio: string;
    socialLinks: string[];
    onCancel: any;
  }
) => {
  if (!state.profile.current) return;

  const usernameChanged = state.profile.current.username !== username;

  try {
    if (usernameChanged) {
      const confirmed = await actions.modals.alertModal.open({
        title: 'Change Username',
        message:
          'Are you sure you want to change your username? You will need to update any external links to your CodeSandbox profile or sandboxes.',
        type: 'danger',
      });

      if (!confirmed) throw new Error();
    }

    const response = await effects.gql.mutations.updateCurrentUser({
      username,
      name,
      bio,
      socialLinks,
    });

    // Pessimistic state update
    state.profile.current.name = response.updateCurrentUser.name;
    state.profile.current.username = response.updateCurrentUser.username;
    state.profile.current.bio = response.updateCurrentUser.bio;
    state.profile.current.socialLinks = response.updateCurrentUser.socialLinks;

    effects.analytics.track('Profile - User profile updated');

    // Redirect user to new username path only if username has changed
    if (usernameChanged) {
      location.href = `/u/${username}`;
    }
  } catch (error) {
    // Reset state in ProfileCard
    onCancel();

    if (
      error.response &&
      error.response.errors[0].message.includes('Username')
    ) {
      effects.notificationToast.error(
        `There was a problem updating your profile: ${error.response.errors[0].message}.`
      );
    } else {
      effects.notificationToast.error(
        'There was a problem updating your profile.'
      );
    }
  }
};

export const addFeaturedSandboxesInState = (
  { state, actions, effects }: Context,
  {
    sandboxId,
  }: {
    sandboxId: Sandbox['id'];
  }
) => {
  if (!state.profile.current) return;

  const username = state.profile.current.username;
  const page = state.profile.currentSandboxesPage;
  const sandboxesOnPage = state.profile.sandboxes[username][page];

  const sandbox = sandboxesOnPage.find(s => s.id === sandboxId);

  // if it is added from sandbox picker, it's not on page
  if (!sandbox) return;

  state.profile.current.featuredSandboxes = [
    ...state.profile.current.featuredSandboxes,
    sandbox,
  ];
};

export const removeFeaturedSandboxesInState = (
  { state, actions, effects }: Context,
  {
    sandboxId,
  }: {
    sandboxId: Sandbox['id'];
  }
) => {
  if (!state.profile.current) return;

  state.profile.current.featuredSandboxes = state.profile.current.featuredSandboxes.filter(
    sandbox => sandbox.id !== sandboxId
  );
};

export const addFeaturedSandboxes = async (
  { actions, effects, state }: Context,
  {
    sandboxId,
  }: {
    sandboxId: Sandbox['id'];
  }
) => {
  if (!state.profile.current) return;

  const currentFeaturedSandboxIds = state.profile.current.featuredSandboxes.map(
    sandbox => sandbox.id
  );

  // already featured
  if (currentFeaturedSandboxIds.includes(sandboxId)) return;

  // optimistic update
  actions.profile.addFeaturedSandboxesInState({ sandboxId });

  try {
    const profile = await effects.api.updateUserFeaturedSandboxes(
      state.profile.current.id,
      [...currentFeaturedSandboxIds, sandboxId]
    );

    state.profile.current.featuredSandboxes = profile.featuredSandboxes;
  } catch (error) {
    // rollback optimisic update
    actions.profile.removeFeaturedSandboxesInState({ sandboxId });

    actions.internal.handleError({
      message: "We weren't able to update your pinned sandboxes",
      error,
    });
  }
};

export const removeFeaturedSandboxes = async (
  { actions, effects, state }: Context,
  {
    sandboxId,
  }: {
    sandboxId: Sandbox['id'];
  }
) => {
  if (!state.profile.current) return;

  const filteredSandboxIds = state.profile.current.featuredSandboxes
    .map(sandbox => sandbox.id)
    .filter(id => id !== sandboxId);

  // optimisic update
  actions.profile.removeFeaturedSandboxesInState({ sandboxId });

  try {
    const profile = await effects.api.updateUserFeaturedSandboxes(
      state.profile.current.id,
      filteredSandboxIds
    );

    state.profile.current.featuredSandboxes = profile.featuredSandboxes;
  } catch (error) {
    // rollback optimisic update
    actions.profile.addFeaturedSandboxesInState({ sandboxId });

    actions.internal.handleError({
      message: "We weren't able to update your pinned sandboxes",
      error,
    });
  }
};

export const reorderFeaturedSandboxesInState = (
  { state }: Context,
  {
    startPosition,
    endPosition,
  }: {
    startPosition: number;
    endPosition: number;
  }
) => {
  if (!state.profile.current) return;

  // optimisic update
  const featuredSandboxes = [...state.profile.current.featuredSandboxes];
  const sandbox = featuredSandboxes[startPosition]!;

  // remove element first
  featuredSandboxes.splice(startPosition, 1);
  // now add at new position
  featuredSandboxes.splice(endPosition, 0, sandbox);

  state.profile.current.featuredSandboxes = featuredSandboxes;
};

export const saveFeaturedSandboxesOrder = async ({
  actions,
  effects,
  state,
}: Context) => {
  if (!state.profile.current) return;

  try {
    const featuredSandboxIds = state.profile.current.featuredSandboxes.map(
      s => s.id
    );
    const profile = await effects.api.updateUserFeaturedSandboxes(
      state.profile.current.id,
      featuredSandboxIds
    );
    state.profile.current.featuredSandboxes = profile.featuredSandboxes;
  } catch (error) {
    // TODO: rollback optimisic update

    actions.internal.handleError({
      message: "We weren't able to re-order your pinned sandboxes",
      error,
    });
  }
};

export const changeSandboxPrivacyInState = (
  { state }: Context,
  { id, privacy }: Pick<Sandbox, 'id' | 'privacy'>
) => {
  if (!state.profile.current) {
    return;
  }

  const username = state.profile.current.username;
  const page = state.profile.currentSandboxesPage;
  const sandboxes = state.profile.sandboxes[username][page];

  state.profile.sandboxes[username][page] = sandboxes.map(sandbox => {
    if (sandbox.id === id) sandbox.privacy = privacy;
    return sandbox;
  });

  // for picker
  state.profile.collections.forEach(collection => {
    collection.sandboxes.forEach(sandbox => {
      if (sandbox.id === id) sandbox.privacy = privacy;
    });
  });
};

export const changeSandboxPrivacy = async (
  { actions, effects }: Context,
  { id, privacy }: Pick<Sandbox, 'id' | 'privacy'>
) => {
  // optimisitc update
  actions.profile.changeSandboxPrivacyInState({ id, privacy });

  try {
    await effects.api.updatePrivacy(id, privacy);
  } catch (error) {
    // rollback optimistic update
    // it is safe to assume that the sandbox was public (privacy:0)
    // earlier because it was on profiles
    actions.profile.changeSandboxPrivacyInState({
      id,
      privacy: 0,
    });

    actions.internal.handleError({
      message: "We weren't able to update sandbox privacy",
      error,
    });
  }
};

export const fetchAllSandboxes = async ({ effects, state }: Context) => {
  if (!state.profile.current) return;

  const { username } = state.profile.current;
  const page = 'all';

  if (!state.profile.sandboxes[username]) {
    state.profile.sandboxes[username] = {};
  }

  if (state.profile.sandboxes[username][page]) return;

  state.profile.isLoadingSandboxes = true;
  const data = await effects.api.getUserSandboxes(username, page);
  state.profile.sandboxes[username][page] = data.sandboxes;
  state.profile.isLoadingSandboxes = false;
};

export const searchQueryChanged = async (
  { state, actions, effects }: Context,
  query: string
) => {
  state.profile.searchQuery = query;

  // Search works on all sandboxes
  // We check for isLoading to avoid multiple requests
  if (!state.profile.isLoadingSandboxes) {
    await actions.profile.fetchAllSandboxes();
  }
};

export const openContextMenu = (
  { state }: Context,
  {
    sandboxId,
    sandboxType,
    position,
  }: {
    sandboxId: Sandbox['id'];
    sandboxType: SandboxType;
    position: { x: number; y: number };
  }
) => {
  state.profile.contextMenu = { sandboxId, sandboxType, position };
};

export const closeContextMenu = ({ state }: Context) => {
  state.profile.contextMenu = {
    sandboxId: null,
    sandboxType: null,
    position: null,
  };
};

export const fetchCollections = async ({ state, effects }: Context) => {
  if (!state.profile.current) return;

  try {
    const data = await effects.gql.queries.getCollections({
      teamId: state.profile.current.personalWorkspaceId,
    });
    if (!data || !data.me || !data.me.collections) {
      return;
    }

    state.profile.collections = data.me.collections.map(collection => ({
      ...collection,
      sandboxes: [],
    }));
  } catch {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const getSandboxesByPath = async (
  { state, effects }: Context,
  { path }: { path: string }
) => {
  if (!state.profile.current) return;

  try {
    const data = await effects.gql.queries.sandboxesByPath({
      path,
      teamId: state.profile.current.personalWorkspaceId,
    });
    if (typeof data?.me?.collection?.sandboxes === 'undefined') {
      return;
    }

    const collection = state.profile.collections.find(c => c.path === path);
    if (!collection) return;

    collection.sandboxes = data.me.collection.sandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};
