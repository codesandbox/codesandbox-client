import { Context } from 'app/overmind';

export const getVercelUserDetails = async ({
  state,
  actions,
  effects,
}: Context) => {
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
        message:
          'We were not able to fetch your Vercel user details. You should still be able to deploy to Vercel, please try again if needed.',
        error,
      });
    }
    state.isLoadingVercel = false;
  }
};
