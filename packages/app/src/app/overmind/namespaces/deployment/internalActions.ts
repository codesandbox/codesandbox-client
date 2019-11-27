import { AsyncAction } from 'app/overmind';

export const getZeitUserDetails: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  if (
    state.user.integrations.zeit &&
    state.user.integrations.zeit.token &&
    !state.user.integrations.zeit.email
  ) {
    state.isLoadingZeit = true;
    try {
      const zeitDetails = await effects.zeit.getUser();
      state.user.integrations.zeit.email = zeitDetails.email;
    } catch (error) {
      error.message = 'Could not authorize with ZEIT';
      actions.internal.handleError(error);
    }
    state.isLoadingZeit = false;
  }
};
