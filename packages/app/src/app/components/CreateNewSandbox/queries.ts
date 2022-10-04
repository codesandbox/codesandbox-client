import track from '@codesandbox/common/lib/utils/analytics';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';
import { client } from 'app/graphql/client';
import {
  ListTemplatesQuery,
  ListTemplatesQueryVariables,
  PathedSandboxesFoldersQueryVariables,
  PathedSandboxesQuery,
  UnmakeSandboxesTemplateMutation,
  UnmakeSandboxesTemplateMutationVariables,
} from 'app/graphql/types';
import {
  PATHED_SANDBOXES_CONTENT_QUERY,
  addSandboxesToFolder,
} from 'app/pages/Dashboard/queries';
import gql from 'graphql-tag';
import immer from 'immer';

const TEMPLATE_FRAGMENT = gql`
  fragment Template on Template {
    id
    color
    iconUrl
    published
    sandbox {
      id
      alias
      title
      description
      insertedAt
      updatedAt
      isV2
      collection {
        team {
          name
        }
      }

      author {
        username
      }

      source {
        template
      }
    }
  }
`;

export const LIST_PERSONAL_TEMPLATES = gql`
  query ListPersonalTemplates {
    me {
      templates {
        ...Template
      }

      recentlyUsedTemplates {
        ...Template

        sandbox {
          git {
            id
            username
            commitSha
            path
            repo
            branch
          }
        }
      }

      bookmarkedTemplates {
        ...Template
      }

      teams {
        id
        name
        bookmarkedTemplates {
          ...Template
        }
        templates {
          ...Template
        }
      }
    }
  }

  ${TEMPLATE_FRAGMENT}
`;

export const LIST_OWNED_TEMPLATES = gql`
  query ListTemplates($showAll: Boolean) {
    me {
      templates(showAll: $showAll) {
        ...Template
      }

      teams {
        id
        name
        templates {
          ...Template
        }
      }
    }
  }

  ${TEMPLATE_FRAGMENT}
`;

export const LIST_BOOKMARKED_TEMPLATES_QUERY = gql`
  query ListPersonalBookmarkedTemplates {
    me {
      teams {
        id
        name
        bookmarkedTemplates {
          ...Template
        }
      }
      bookmarkedTemplates {
        ...Template
      }
    }
  }

  ${TEMPLATE_FRAGMENT}
`;

export const GET_GITHUB_REPO = gql`
  query GetGithubRepo($owner: String!, $name: String!) {
    githubRepo(owner: $owner, repo: $name) {
      name
      fullName
      updatedAt
      authorization
      owner {
        id
        login
        avatarUrl
      }
    }
  }
`;

export const MAKE_SANDBOXES_TEMPLATE_MUTATION = gql`
  mutation MakeSandboxesTemplate($sandboxIds: [ID!]!) {
    makeSandboxesTemplates(sandboxIds: $sandboxIds) {
      id
    }
  }
`;

export const UNMAKE_SANDBOXES_TEMPLATE_MUTATION = gql`
  mutation UnmakeSandboxesTemplate($sandboxIds: [ID!]!) {
    unmakeSandboxesTemplates(sandboxIds: $sandboxIds) {
      id
    }
  }
`;

export function unmakeTemplates(selectedSandboxes: string[]) {
  return client.mutate<
    UnmakeSandboxesTemplateMutation,
    UnmakeSandboxesTemplateMutationVariables
  >({
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
        const variables: ListTemplatesQueryVariables = {
          showAll: false,
        };

        const oldTemplatesCache = cache.readQuery<
          ListTemplatesQuery,
          ListTemplatesQueryVariables
        >({
          query: LIST_OWNED_TEMPLATES,
          variables,
        });

        const data = immer(oldTemplatesCache, draft => {
          if (draft?.me?.templates && draft?.me?.teams) {
            draft.me.templates = draft.me.templates.filter(x =>
              x?.sandbox?.id
                ? selectedSandboxes.indexOf(x.sandbox.id) === -1
                : true
            );

            draft.me.teams = draft.me.teams.map(t => ({
              ...t,
              templates: t?.templates?.filter(x =>
                x?.sandbox?.id
                  ? selectedSandboxes.indexOf(x.sandbox.id) === -1
                  : true
              ),
              // Giving up
            })) as any;
          }
        });

        if (data) {
          cache.writeQuery<ListTemplatesQuery, ListTemplatesQueryVariables>({
            query: LIST_OWNED_TEMPLATES,
            variables,
            data,
          });
        }
      } catch (e) {
        // cache doesn't exist, no biggie!
      }
    },
  });
}

export function makeTemplates(
  selectedSandboxes: string[],
  teamId: string | null,
  collections?: { teamId: string | null }[]
) {
  const unpackedSelectedSandboxes: string[] =
    // @ts-ignore
    typeof selectedSandboxes.toJS === 'function'
      ? (selectedSandboxes as any).toJS()
      : selectedSandboxes;
  return Promise.all([
    addSandboxesToFolder(unpackedSelectedSandboxes, '/', teamId),
    client
      .mutate({
        mutation: MAKE_SANDBOXES_TEMPLATE_MUTATION,
        variables: {
          sandboxIds: unpackedSelectedSandboxes,
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
            collections.forEach(variables => {
              try {
                const oldFolderCacheData = cache.readQuery<
                  PathedSandboxesQuery,
                  PathedSandboxesFoldersQueryVariables
                >({
                  query: PATHED_SANDBOXES_CONTENT_QUERY,
                  variables,
                });

                const data = immer(oldFolderCacheData, draft => {
                  if (
                    draft?.me?.collection &&
                    oldFolderCacheData?.me?.collection?.sandboxes
                  ) {
                    draft.me.collection.sandboxes = oldFolderCacheData.me.collection.sandboxes.filter(
                      x =>
                        x?.id ? selectedSandboxes.indexOf(x.id) === -1 : true
                    );
                  }
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
          message: `Successfully created ${selectedSandboxes.length} template${
            selectedSandboxes.length === 1 ? '' : 's'
          }`,
          status: NotificationStatus.SUCCESS,
          actions: {
            primary: {
              label: 'Undo',
              run: () => {
                track('Template - Removed', {
                  source: 'Undo',
                });
                unmakeTemplates(unpackedSelectedSandboxes);
              },
            },
          },
        });
      }),
  ]);
}
