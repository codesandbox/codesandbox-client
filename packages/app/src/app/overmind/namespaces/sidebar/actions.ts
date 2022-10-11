import type { Context } from 'app/overmind';
import type {
  SidebarSyncedSandboxFragmentFragment,
  SidebarTemplateFragmentFragment,
} from 'app/graphql/types';

export const getSidebarData = async (
  { state, effects }: Context,
  teamId?: string
) => {
  const {
    gql: { queries },
  } = effects;

  try {
    let sandboxes: SidebarSyncedSandboxFragmentFragment[] | null;
    let templates: SidebarTemplateFragmentFragment[] | null;

    if (teamId) {
      /**
       * Fetch data for the selected team
       */
      const result = await queries.getTeamSidebarData({ id: teamId });

      sandboxes = result.me?.team?.sandboxes || null;
      templates = result.me?.team?.templates || null;
    } else {
      /**
       * Fetch data for the user
       */
      const result = await queries.getPersonalSidebarData();

      sandboxes = result.me?.sandboxes || null;
      templates = result.me?.templates || null;
    }

    const hasSyncedSandboxes = sandboxes && sandboxes.length > 0;
    const hasTemplates = templates && templates.length > 0;

    state.sidebar = {
      hasSyncedSandboxes,
      hasTemplates,
    };
  } catch {
    effects.notificationToast.error(
      `There was a problem getting your data for the sidebar.`
    );
  }
};
