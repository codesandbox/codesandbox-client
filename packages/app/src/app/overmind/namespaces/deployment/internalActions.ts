import { AsyncAction } from 'app/overmind';

export const getZeitUserDetails: AsyncAction = async ({ state, effects }) => {
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
      effects.notificationToast.error('Could not authorize with ZEIT');
    }
    state.isLoadingZeit = false;
  }
};
