import gql from 'graphql-tag';
import { client } from 'app/graphql/client';
import immer from 'immer';
import {
  SANDBOX_FRAGMENT,
  addSandboxesToFolder,
  PATHED_SANDBOXES_CONTENT_QUERY,
} from 'app/pages/Dashboard/queries';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import track from '@codesandbox/common/lib/utils/analytics';
import { NotificationStatus } from '@codesandbox/notifications';

export const LIST_FOLLOWED_TEMPLATES = gql`
  query ListFollowedTemplates {
    me {
      teams {
        id
        name
        subscribedTemplates {
          color
          iconUrl
          id
          published
          sandbox {
            ...Sandbox
          }
        }
      }
      subscribedTemplates {
        color
        iconUrl
        id
        published
        sandbox {
          ...Sandbox
        }
      }
    }
  }

  ${SANDBOX_FRAGMENT}
`;

export const LIST_TEMPLATES = gql`
  query ListTemplates($teamId: ID, $showAll: Boolean) {
    me {
      templates(teamId: $teamId, showAll: $showAll) {
        color
        iconUrl
        id
        published
        sandbox {
          ...Sandbox
        }
      }
    }
  }

  ${SANDBOX_FRAGMENT}
`;

export const MAKE_SANDBOXES_TEMPLATE_MUTATION = gql`
  mutation MakeSandboxesTemplate($sandboxIds: [ID]!) {
    makeSandboxesTemplates(sandboxIds: $sandboxIds) {
      id
    }
  }
`;

export const UNMAKE_SANDBOXES_TEMPLATE_MUTATION = gql`
  mutation UnmakeSandboxesTemplate($sandboxIds: [ID]!) {
    unmakeSandboxesTemplates(sandboxIds: $sandboxIds) {
      id
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export function unmakeTemplates(selectedSandboxes, teamId) {
  return client.mutate({
    mutation: UNMAKE_SANDBOXES_TEMPLATE_MUTATION,
    variables: {
      sandboxIds: selectedSandboxes,
    },
    refetchQueries: [
      'DeletedSandboxes',
      'PathedSandboxes',
      'RecentSandboxes',
      'SearchSandboxes',
      'ListTemplates',
    ],
    update: cache => {
      try {
        const variables = {};

        if (teamId) {
          variables.teamId = teamId;
        }

        const oldTemplatesCache = cache.readQuery({
          query: LIST_TEMPLATES,
          variables,
        });

        const data = immer(oldTemplatesCache, draft => {
          draft.me.templates = draft.me.templates.filter(
            x => selectedSandboxes.indexOf(x.sandbox.id) === -1
          );
        });

        cache.writeQuery({
          query: LIST_TEMPLATES,
          variables,
          data,
        });
      } catch (e) {
        // cache doesn't exist, no biggie!
      }
    },
  });
}

export function makeTemplates(selectedSandboxes, teamId, collections) {
  return Promise.all([
    addSandboxesToFolder(selectedSandboxes, '/', teamId),
    client
      .mutate({
        mutation: MAKE_SANDBOXES_TEMPLATE_MUTATION,
        variables: {
          sandboxIds: selectedSandboxes.toJS(),
        },
        refetchQueries: [
          'DeletedSandboxes',
          'PathedSandboxes',
          'RecentSandboxes',
          'SearchSandboxes',
          'ListTemplates',
        ],
        update: cache => {
          if (collections) {
            collections.forEach(({ path, teamId: cacheTeamId }) => {
              try {
                const variables = { path };

                if (cacheTeamId) {
                  variables.teamId = cacheTeamId;
                }

                const oldFolderCacheData = cache.readQuery({
                  query: PATHED_SANDBOXES_CONTENT_QUERY,
                  variables,
                });

                const data = immer(oldFolderCacheData, draft => {
                  draft.me.collection.sandboxes = oldFolderCacheData.me.collection.sandboxes.filter(
                    x => selectedSandboxes.indexOf(x.id) === -1
                  );
                });

                cache.writeQuery({
                  query: PATHED_SANDBOXES_CONTENT_QUERY,
                  variables,
                  data,
                });
              } catch (e) {
                // cache doesn't exist, no biggie!
              }
            });
          }
        },
      })
      .then(() => {
        notificationState.addNotification({
          title: `Successfully created ${selectedSandboxes.length} template${
            selectedSandboxes.length === 1 ? '' : 's'
          }`,
          status: NotificationStatus.SUCCESS,
          actions: {
            primary: [
              {
                label: 'Undo',
                run: () => {
                  track('Template - Removed', {
                    source: 'Undo',
                  });
                  unmakeTemplates(selectedSandboxes.toJS());
                },
              },
            ],
          },
        });
      }),
  ]);
}
