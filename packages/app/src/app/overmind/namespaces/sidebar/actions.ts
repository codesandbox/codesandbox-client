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
     * Fetch data for the selected team using split queries to reduce complexity
     * - Flags query: lightweight check for syncedSandboxes and templates flags
     * - Projects query: fetches all projects separately
     */
    const [flagsResult, projectsResult] = await Promise.all([
      queries.getTeamSidebarFlags({ id: teamId }),
      queries.getTeamSidebarProjects({ id: teamId }),
    ]);

    const syncedSandboxes = flagsResult.me?.team?.syncedSandboxes || null;
    const templates = flagsResult.me?.team?.templates || null;
    const repositories =
      projectsResult.me?.team?.projects?.map(p => ({
        owner: p.repository.owner,
        name: p.repository.name,
        defaultBranch: p.repository.defaultBranch,
      })) || [];

    // Since we're using limit: 1 for syncedSandboxes, we only need to check if arrays have items
    const hasSyncedSandboxes = syncedSandboxes && syncedSandboxes.length > 0;
    const hasTemplates = templates && templates.length > 0;

    state.sidebar[teamId] = {
      hasSyncedSandboxes,
      hasTemplates,
      repositories,
    };
  } catch (error) {
    effects.notificationToast.error(
      `There was a problem getting your data for the sidebar.`
    );
  }
};
