import { SidebarCollectionFragmentFragment } from 'app/graphql/types';
import { Context } from 'app/overmind';
import { getDecoratedCollection } from '../dashboard/utils';

const decorateCollections = (
  collections: Array<SidebarCollectionFragmentFragment>
) =>
  collections.map(collection => {
    const decorated = getDecoratedCollection(collection);

    return {
      path: decorated.path,
      parent: decorated.parent,
      name: decorated.name,
    };
  });

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
      const decoratedCollections = decorateCollections(collections);

      state.sidebar = {
        hasSyncedSandboxes,
        hasTemplates,
        collections: decoratedCollections,
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
      const decoratedCollections = decorateCollections(collections);

      state.sidebar = {
        hasSyncedSandboxes,
        hasTemplates,
        collections: decoratedCollections,
      };
    }
  } catch {
    effects.notificationToast.error(
      `There was a problem getting your data for the sidebar.`
    );
  }
};
