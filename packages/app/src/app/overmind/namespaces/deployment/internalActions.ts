import { AsyncAction } from 'app/overmind';

export const getZeitUserDetails: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  if (
    state.user &&
    state.user.integrations.zeit &&
    state.user.integrations.zeit.token &&
    !state.user.integrations.zeit.email
  ) {
    state.isLoadingZeit = true;
    try {
      const zeitDetails = await effects.zeit.getUser();
      state.user.integrations.zeit.email = zeitDetails.email;
    } catch (error) {
      actions.internal.handleError({
        message: 'Could not authorize with ZEIT',
        error,
      });
    }
    state.isLoadingZeit = false;
  }
};
