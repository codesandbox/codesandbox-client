import type { Context } from 'app/overmind';

export const getSidebarData = async (
  { state, effects }: Context,
  teamId: string
) => {
  const {
    gql: { queries },
  } = effects;

  try {
    /**
     * Fetch data for the selected team
     */
    const result = await queries.getTeamSidebarData({ id: teamId });

    const sandboxes = result.me?.team?.sandboxes || null;
    const templates = result.me?.team?.templates || null;
    const repositories =
      result.me?.team?.projects?.map(p => ({
        owner: p.repository.owner,
        name: p.repository.name,
      })) || [];

    const hasSyncedSandboxes = sandboxes && sandboxes.length > 0;
    const hasTemplates = templates && templates.length > 0;

    state.sidebar[teamId] = {
      hasSyncedSandboxes,
      hasTemplates,
      repositories,
    };
  } catch {
    effects.notificationToast.error(
      `There was a problem getting your data for the sidebar.`
    );
  }
};
