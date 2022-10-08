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
          team: { sandboxes, templates, collections },
        },
      } = await queries.getTeamSidebarData({ id: teamId });

      const hasSyncedSandboxes = sandboxes?.length > 0;
      const hasTemplates = templates?.length > 0;

      state.sidebar = {
        hasSyncedSandboxes,
        hasTemplates,
        collections,
      };
    } else {
      /**
       * Fetch data for the user
       */
      const {
        me: { sandboxes, templates, collections },
      } = await queries.getPersonalSidebarData();

      const hasSyncedSandboxes = sandboxes?.length > 0;
      const hasTemplates = templates?.length > 0;

      state.sidebar = {
        hasSyncedSandboxes,
        hasTemplates,
        collections,
      };
    }
  } catch {
    effects.notificationToast.error(
      `There was a problem getting your data for the sidebar.`
    );
  }
};
