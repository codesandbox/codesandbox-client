import { Sandbox } from '@codesandbox/common/lib/types';
import { Action, AsyncAction } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';

export const profileMounted: AsyncAction<string> = withLoadApp(
  async ({ effects, state }, username) => {
    state.profile.isLoadingProfile = true;
    state.profile.notFound = false;

    const profile = await effects.api.getProfile(username);

    state.profile.profiles[profile.id] = profile;
    state.profile.currentProfileId = profile.id;

    if (
      profile.showcasedSandboxShortid &&
      !state.editor.sandboxes[profile.showcasedSandboxShortid]
    ) {
      state.editor.sandboxes[
        profile.showcasedSandboxShortid
      ] = await effects.api.getSandbox(profile.showcasedSandboxShortid);
    }

    state.profile.isLoadingProfile = false;
  }
);

export const sandboxesPageChanged: AsyncAction<number> = async (
  { effects, state },
  page
) => {
  state.profile.isLoadingSandboxes = true;
  state.profile.currentSandboxesPage = page;

  if (!state.profile.current) {
    return;
  }

  const { username } = state.profile.current;
  if (
    !state.profile.sandboxes[username] ||
    !state.profile.sandboxes[username][page]
  ) {
    const data = await effects.api.getUserSandboxes(username, page);
    if (!state.profile.sandboxes[username]) {
      state.profile.sandboxes[username] = {};
    }
    state.profile.sandboxes[username][page] = data[page];
  }

  state.profile.isLoadingSandboxes = false;
};

export const likedSandboxesPageChanged: AsyncAction<number> = async (
  { effects, state },
  page
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

export const selectSandboxClicked: AsyncAction = async ({ state, effects }) => {
  state.currentModal = 'selectSandbox';

  if (!state.profile.userSandboxes.length) {
    state.profile.isLoadingSandboxes = true;
    state.profile.userSandboxes = await effects.api.getSandboxes();
    state.profile.isLoadingSandboxes = false;
  }
};

export const newSandboxShowcaseSelected: AsyncAction<string> = async (
  { state, effects },
  id
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

  const [sandbox] = await Promise.all([
    state.editor.sandboxes[id] ? null : effects.api.getSandbox(id),
    effects.api.updateShowcasedSandbox(state.user.username, id),
  ]);

  if (sandbox) {
    state.editor.sandboxes[id] = sandbox as Sandbox;
  }

  state.profile.isLoadingProfile = false;
};

export const deleteSandboxClicked: Action<string> = ({ state }, id) => {
  state.profile.sandboxToDeleteId = id;
  state.currentModal = 'deleteProfileSandbox';
};

export const sandboxDeleted: AsyncAction = async ({ state, effects }) => {
  state.profile.isLoadingSandboxes = true;
  state.currentModal = null;

  const sandboxId = state.profile.sandboxToDeleteId;

  if (!sandboxId || !state.profile.current || !state.user) {
    return;
  }

  await effects.api.deleteSandbox(sandboxId);

  state.profile.current.sandboxCount--;

  const page = state.profile.currentSandboxesPage;
  const { username } = state.user;
  const data = await effects.api.getUserSandboxes(username, page);

  state.profile.sandboxes[username][page] = data[page];

  state.profile.isLoadingSandboxes = false;
};

export const updateUserProfile: AsyncAction<{
  bio: string;
  socialLinks: string[];
}> = async ({ actions, effects, state }, { bio, socialLinks }) => {
  if (!state.profile.current) return;

  // optimistic update
  const oldBio = state.profile.current.bio;
  state.profile.current.bio = bio;
  const oldSocialLinks = state.profile.current.socialLinks;
  state.profile.current.socialLinks = socialLinks;

  try {
    await effects.api.updateUserProfile(
      state.profile.current.id,
      bio,
      socialLinks
    );
  } catch (error) {
    // revert optimistic update
    state.profile.current.bio = oldBio;
    state.profile.current.socialLinks = oldSocialLinks;

    actions.internal.handleError({
      message: "We weren't able to update your bio",
      error,
    });
  }
};

export const addFeaturedSandboxes: AsyncAction<{
  sandboxId: string;
}> = async ({ actions, effects, state }, { sandboxId }) => {
  if (!state.profile.current) return;

  const oldFeaturedSandboxIds = state.profile.current.featuredSandboxes.map(
    sandbox => sandbox.id
  );

  try {
    const profile = await effects.api.updateUserFeaturedSandboxes(
      state.profile.current.id,
      [...oldFeaturedSandboxIds, sandboxId]
    );

    state.profile.current.featuredSandboxes = profile.featuredSandboxes;
  } catch (error) {
    actions.internal.handleError({
      message: "We weren't able to update your pinned sandboxes",
      error,
    });
  }
};
