import { Context } from 'app/overmind';

export const getSidebarData = async (
  { state, effects }: Context,
  teamId?: string
) => {
  const {
    gql: { queries },
  } = effects;

  try {
    if (teamId) {
      /**
       * Fetch data for the selected team
       */
      const {
        me: {
          team: { sandboxes, ...restData },
        },
      } = await queries.getTeamSidebarData({ id: teamId });

      state.sidebar = {
        /**
         * Renaming sandboxes to syncedSandboxes
         */
        syncedSandboxes: sandboxes,
        ...restData,
      };
    } else {
      /**
       * Fetch data for the user
       */
      const {
        me: { sandboxes, ...restData },
      } = await queries.getPersonalSidebarData();

      state.sidebar = {
        /**
         * Renaming sandboxes to syncedSandboxes
         */
        syncedSandboxes: sandboxes,
        ...restData,
      };
    }
  } catch {
    effects.notificationToast.error(
      `There was a problem getting your data for the sidebar.`
    );
  }
};
