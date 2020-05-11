import { AsyncAction } from 'app/overmind';

export const getVercelUserDetails: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  if (
    state.user &&
    state.user.integrations.vercel &&
    state.user.integrations.vercel.token &&
    !state.user.integrations.vercel.email
  ) {
    state.isLoadingVercel = true;
    try {
      const vercelDetails = await effects.vercel.getUser();
      state.user.integrations.vercel.email = vercelDetails.email;
    } catch (error) {
      actions.internal.handleError({
        message: 'Could not authorize with Vercel',
        error,
      });
    }
    state.isLoadingVercel = false;
  }
};
