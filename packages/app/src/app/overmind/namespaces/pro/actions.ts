import { withLoadApp } from 'app/overmind/factories';

export const pageMounted = withLoadApp(async ({ effects, state, actions }) => {
  // We have to call the api effect directly rather than using an action because
  // for some reason an action doesn't work.
  const prices = await effects.api.getPrices();

  if (prices) {
    state.pro.prices = prices;
  }

  // This action does work.
  actions.getActiveTeamInfo();
});
