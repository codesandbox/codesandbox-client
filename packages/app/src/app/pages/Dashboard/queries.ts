import { client } from 'app/graphql/client';
import {
  AddToCollectionMutation,
  AddToCollectionMutationVariables,
  DeleteSandboxesMutation,
  DeleteSandboxesMutationVariables,
  DeletedSandboxesQuery,
  DeletedSandboxesQueryVariables,
  PathedSandboxesQuery,
  PathedSandboxesQueryVariables,
  PermanentlyDeleteSandboxesMutation,
  PermanentlyDeleteSandboxesMutationVariables,
} from 'app/graphql/types';
import gql from 'graphql-tag';
import immer from 'immer';

const SIDEBAR_COLLECTION_FRAGMENT = gql`
  fragment SidebarCollection on Collection {
    id
    path
  }
`;

export const SANDBOX_FRAGMENT = gql`
  fragment Sandbox on Sandbox {
    id
    alias
    title
    description
    insertedAt
    updatedAt
    removedAt
    privacy
    screenshotUrl
    screenshotOutdated

    source {
      template
    }

    customTemplate {
      id
    }

    forkedTemplate {
      id
      color
    }

    teamId

    collection {
      path
      teamId
    }
  }
`;

const TEAM_FRAGMENT = gql`
  fragment Team on Team {
    id
    name
    inviteToken
    description
    creatorId

    users {
      id
      name
      username
      avatarUrl
    }

    invitees {
      id
      name
      username
      avatarUrl
    }
  }
`;

export const TEAMS_QUERY = gql`
  query TeamsSidebar {
    me {
      teams {
        id
        name
      }
    }
  }
`;

export const PATHED_SANDBOXES_FOLDER_QUERY = gql`
  query PathedSandboxesFolders($teamId: ID) {
    me {
      collections(teamId: $teamId) {
        ...SidebarCollection
      }
    }
  }
  ${SIDEBAR_COLLECTION_FRAGMENT}
`;

export const CREATE_FOLDER_MUTATION = gql`
  mutation createCollection($path: String!, $teamId: UUID4) {
    createCollection(path: $path, teamId: $teamId) {
      ...SidebarCollection
    }
  }
  ${SIDEBAR_COLLECTION_FRAGMENT}
`;

export const DELETE_FOLDER_MUTATION = gql`
  mutation deleteCollection($path: String!, $teamId: UUID4) {
    deleteCollection(path: $path, teamId: $teamId) {
      ...SidebarCollection
    }
  }
  ${SIDEBAR_COLLECTION_FRAGMENT}
`;

export const RENAME_FOLDER_MUTATION = gql`
  mutation renameCollection(
    $path: String!
    $newPath: String!
    $teamId: UUID4
    $newTeamId: UUID4
  ) {
    renameCollection(
      path: $path
      newPath: $newPath
      teamId: $teamId
      newTeamId: $newTeamId
    ) {
      ...SidebarCollection
    }
  }
  ${SIDEBAR_COLLECTION_FRAGMENT}
`;

export const ADD_SANDBOXES_TO_FOLDER_MUTATION = gql`
  mutation AddToCollection(
    $collectionPath: String
    $sandboxIds: [ID!]!
    $teamId: UUID4
  ) {
    addToCollectionOrTeam(
      collectionPath: $collectionPath
      sandboxIds: $sandboxIds
      teamId: $teamId
    ) {
      ...Sandbox
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const DELETE_SANDBOXES_MUTATION = gql`
  mutation DeleteSandboxes($sandboxIds: [ID!]!) {
    deleteSandboxes(sandboxIds: $sandboxIds) {
      ...Sandbox
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const SET_SANDBOXES_PRIVACY_MUTATION = gql`
  mutation SetSandboxesPrivacy($sandboxIds: [ID!]!, $privacy: Int!) {
    setSandboxesPrivacy(sandboxIds: $sandboxIds, privacy: $privacy) {
      ...Sandbox
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const RENAME_SANDBOX_MUTATION = gql`
  mutation RenameSandbox($id: ID!, $title: String!) {
    renameSandbox(id: $id, title: $title) {
      ...Sandbox
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const PERMANENTLY_DELETE_SANDBOXES_MUTATION = gql`
  mutation PermanentlyDeleteSandboxes($sandboxIds: [ID!]!) {
    permanentlyDeleteSandboxes(sandboxIds: $sandboxIds) {
      id
    }
  }
`;

export const PATHED_SANDBOXES_CONTENT_QUERY = gql`
  query PathedSandboxes($path: String!, $teamId: ID) {
    me {
      collections(teamId: $teamId) {
        ...SidebarCollection
      }
      collection(path: $path, teamId: $teamId) {
        id
        path
        sandboxes {
          ...Sandbox
        }
      }
    }
  }
  ${SANDBOX_FRAGMENT}
  ${SIDEBAR_COLLECTION_FRAGMENT}
`;

export const RECENT_SANDBOXES_CONTENT_QUERY = gql`
  query RecentSandboxes($orderField: String!, $orderDirection: Direction!) {
    me {
      sandboxes(
        limit: 20
        orderBy: { field: $orderField, direction: $orderDirection }
      ) {
        ...Sandbox
      }
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const SEARCH_SANDBOXES_QUERY = gql`
  query SearchSandboxes {
    me {
      sandboxes(orderBy: { field: "updated_at", direction: DESC }) {
        ...Sandbox
      }
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const DELETED_SANDBOXES_CONTENT_QUERY = gql`
  query DeletedSandboxes {
    me {
      sandboxes(
        showDeleted: true
        orderBy: { field: "updated_at", direction: DESC }
      ) {
        ...Sandbox
      }
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export function addSandboxesToFolder(
  selectedSandboxes: string[],
  path: string | null,
  teamId: string | null
) {
  return client.mutate<
    AddToCollectionMutation,
    AddToCollectionMutationVariables
  >({
    mutation: ADD_SANDBOXES_TO_FOLDER_MUTATION,
    variables: {
      sandboxIds: selectedSandboxes,
      teamId,
      collectionPath: path,
    },
    optimisticResponse: {
      __typename: 'RootMutationType',
      addToCollectionOrTeam: [],
    },

    refetchQueries: ['PathedSandboxes'],
  });
}

export function undeleteSandboxes(selectedSandboxes) {
  client.mutate<AddToCollectionMutation, AddToCollectionMutationVariables>({
    mutation: ADD_SANDBOXES_TO_FOLDER_MUTATION,
    // @ts-ignore
    variables: {
      sandboxIds: selectedSandboxes.toJS
        ? selectedSandboxes.toJS()
        : selectedSandboxes,
      collectionPath: '/',
    },
    optimisticResponse: {
      __typename: 'RootMutationType',
      addToCollectionOrTeam: [],
    },

    refetchQueries: ['DeletedSandboxes'],
  });
}

export function permanentlyDeleteSandboxes(selectedSandboxes: string[]) {
  return client.mutate<
    PermanentlyDeleteSandboxesMutation,
    PermanentlyDeleteSandboxesMutationVariables
  >({
    mutation: PERMANENTLY_DELETE_SANDBOXES_MUTATION,
    variables: {
      sandboxIds: selectedSandboxes,
    },
    update: cache => {
      try {
        const oldDeleteCache = cache.readQuery<
          DeletedSandboxesQuery,
          DeletedSandboxesQueryVariables
        >({
          query: DELETED_SANDBOXES_CONTENT_QUERY,
        });

        const newDeleteCache = {
          ...oldDeleteCache,
          me: {
            ...(oldDeleteCache && oldDeleteCache.me ? oldDeleteCache.me : null),
            sandboxes: (oldDeleteCache?.me?.sandboxes || []).filter(
              x => !selectedSandboxes.includes(x.id)
            ),
          },
        };

        cache.writeQuery({
          query: DELETED_SANDBOXES_CONTENT_QUERY,
          data: newDeleteCache,
        });
      } catch (e) {
        // cache doesn't exist, no biggie!
      }
    },
  });
}

export function deleteSandboxes(selectedSandboxes, collections = []) {
  client.mutate<DeleteSandboxesMutation, DeleteSandboxesMutationVariables>({
    mutation: DELETE_SANDBOXES_MUTATION,
    variables: {
      sandboxIds: selectedSandboxes.toJS
        ? selectedSandboxes.toJS()
        : selectedSandboxes,
    },
    refetchQueries: [
      'DeletedSandboxes',
      'PathedSandboxes',
      'RecentSandboxes',
      'SearchSandboxes',
    ],
    update: cache => {
      if (collections) {
        collections.forEach(({ path, teamId }) => {
          try {
            const variables = {
              path,
              teamId,
            };

            const oldFolderCacheData = cache.readQuery<
              PathedSandboxesQuery,
              PathedSandboxesQueryVariables
            >({
              query: PATHED_SANDBOXES_CONTENT_QUERY,
              variables,
            });

            const data = immer(oldFolderCacheData, draft => {
              if (
                !draft?.me?.collection ||
                !oldFolderCacheData?.me?.collection?.sandboxes
              ) {
                return;
              }
              draft.me.collection.sandboxes = oldFolderCacheData.me.collection.sandboxes.filter(
                x => !selectedSandboxes.includes(x?.id)
              );
            });

            if (data) {
              cache.writeQuery<
                PathedSandboxesQuery,
                PathedSandboxesQueryVariables
              >({
                query: PATHED_SANDBOXES_CONTENT_QUERY,
                variables,
                data,
              });
            }
          } catch (e) {
            // cache doesn't exist, no biggie!
          }
        });
      }
    },
  });
}

export function setSandboxesPrivacy(
  selectedSandboxes: string[],
  privacy: 0 | 1 | 2
) {
  client.mutate({
    mutation: SET_SANDBOXES_PRIVACY_MUTATION,
    variables: {
      sandboxIds: selectedSandboxes,
      privacy,
    },
  });
}

export const TEAM_QUERY = gql`
  query Team($id: UUID4!) {
    me {
      team(id: $id) {
        ...Team
      }
    }
  }
  ${TEAM_FRAGMENT}
`;

export const ACCEPT_TEAM_INVITATION = gql`
  mutation AcceptTeamInvitation($teamId: UUID4!) {
    acceptTeamInvitation(teamId: $teamId) {
      ...Team
    }
  }
  ${TEAM_FRAGMENT}
`;

export const REJECT_TEAM_INVITATION = gql`
  mutation RejectTeamInvitation($teamId: UUID4!) {
    rejectTeamInvitation(teamId: $teamId)
  }
`;
