import gql from 'graphql-tag';
import { client } from 'app/graphql/client';

const SIDEBAR_COLLECTION_FRAGMENT = gql`
  fragment SidebarCollection on Collection {
    id
    path
  }
`;

const SANDBOX_FRAGMENT = gql`
  fragment Sandbox on Sandbox {
    id
    title
    description
    insertedAt
    updatedAt
    privacy
    screenshotUrl

    source {
      template
    }

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

export const CREATE_TEAM_MUTATION = gql`
  mutation CreateTeam($name: String!) {
    createTeam(name: $name) {
      ...Team
    }
  }
  ${TEAM_FRAGMENT}
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
  mutation createCollection($path: String!, $teamId: ID) {
    createCollection(path: $path, teamId: $teamId) {
      ...SidebarCollection
    }
  }
  ${SIDEBAR_COLLECTION_FRAGMENT}
`;

export const DELETE_FOLDER_MUTATION = gql`
  mutation deleteCollection($path: String!, $teamId: ID) {
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
    $teamId: ID
    $newTeamId: ID
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
    $collectionPath: String!
    $sandboxIds: [ID]!
    $teamId: ID
  ) {
    addToCollection(
      collectionPath: $collectionPath
      sandboxIds: $sandboxIds
      teamId: $teamId
    ) {
      sandboxes {
        ...Sandbox
      }
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const DELETE_SANDBOXES_MUTATION = gql`
  mutation DeleteSandboxes($sandboxIds: [ID]!) {
    deleteSandboxes(sandboxIds: $sandboxIds) {
      ...Sandbox
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const SET_SANDBOXES_PRIVACY_MUTATION = gql`
  mutation SetSandboxesPrivacy($sandboxIds: [ID]!, $privacy: Int!) {
    setSandboxesPrivacy(sandboxIds: $sandboxIds, privacy: $privacy) {
      ...Sandbox
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const RENAME_SANDBOX_MUTATION = gql`
  mutation RenameSandbox($id: [ID]!, $title: String!) {
    renameSandbox(id: $id, title: $title) {
      ...Sandbox
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const PERMANENTLY_DELETE_SANDBOXES_MUTATION = gql`
  mutation PermanentlyDeleteSandboxes($sandboxIds: [ID]!) {
    permanentlyDeleteSandboxes(sandboxIds: $sandboxIds) {
      ...Sandbox
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const PATHED_SANDBOXES_CONTENT_QUERY = gql`
  query PathedSandboxes($path: String!, $teamId: ID) {
    me {
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
        removedAt
      }
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export function addSandboxesToFolder(selectedSandboxes, path, teamId) {
  return client.mutate({
    mutation: ADD_SANDBOXES_TO_FOLDER_MUTATION,
    variables: {
      sandboxIds: selectedSandboxes,
      teamId,
      collectionPath: path,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      addToCollection: {
        __typename: 'Collection',
        // We keep this empty, because it will be loaded later regardless. We
        // just want the main directory to update immediately
        sandboxes: [],
      },
    },

    refetchQueries: ['PathedSandboxes'],
  });
}

export function undeleteSandboxes(selectedSandboxes) {
  client.mutate({
    mutation: ADD_SANDBOXES_TO_FOLDER_MUTATION,
    variables: {
      sandboxIds: selectedSandboxes.toJS(),
      collectionPath: '/',
    },
    optimisticResponse: {
      __typename: 'Mutation',
      addToCollection: {
        __typename: 'Collection',
        // We keep this empty, because it will be loaded later regardless. We
        // just want the main directory to update immediately
        sandboxes: [],
      },
    },

    refetchQueries: ['DeletedSandboxes'],
  });
}

export function permanentlyDeleteSandboxes(selectedSandboxes) {
  client.mutate({
    mutation: PERMANENTLY_DELETE_SANDBOXES_MUTATION,
    variables: {
      sandboxIds: selectedSandboxes.toJS(),
    },
    update: cache => {
      try {
        const oldDeleteCache = cache.readQuery({
          query: DELETED_SANDBOXES_CONTENT_QUERY,
        });

        const newDeleteCache = {
          ...oldDeleteCache,
          me: {
            ...oldDeleteCache.me,
            sandboxes: oldDeleteCache.me.sandboxes.filter(
              x => selectedSandboxes.indexOf(x.id) === -1
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
  client.mutate({
    mutation: DELETE_SANDBOXES_MUTATION,
    variables: {
      sandboxIds: selectedSandboxes.toJS(),
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
            const oldFolderCacheData = cache.readQuery({
              query: PATHED_SANDBOXES_CONTENT_QUERY,
              variables: { path, teamId },
            });

            oldFolderCacheData.me.collection.sandboxes = oldFolderCacheData.me.collection.sandboxes.filter(
              x => selectedSandboxes.indexOf(x.id) === -1
            );

            cache.writeQuery({
              query: PATHED_SANDBOXES_CONTENT_QUERY,
              variables: { path, teamId },
              data: oldFolderCacheData,
            });
          } catch (e) {
            // cache doesn't exist, no biggie!
          }
        });
      }
    },
  });
}

export function setSandboxesPrivacy(selectedSandboxes, privacy) {
  client.mutate({
    mutation: SET_SANDBOXES_PRIVACY_MUTATION,
    variables: {
      sandboxIds: selectedSandboxes.toJS(),
      privacy,
    },
  });
}

export const TEAM_QUERY = gql`
  query Team($id: ID!) {
    me {
      team(id: $id) {
        ...Team
      }
    }
  }
  ${TEAM_FRAGMENT}
`;

export const LEAVE_TEAM = gql`
  mutation LeaveTeam($teamId: ID!) {
    leaveTeam(teamId: $teamId)
  }
`;

export const REMOVE_FROM_TEAM = gql`
  mutation RemoveFromTeam($teamId: ID!, $userId: ID!) {
    removeFromTeam(teamId: $teamId, userId: $userId) {
      ...Team
    }
  }
  ${TEAM_FRAGMENT}
`;

export const INVITE_TO_TEAM = gql`
  mutation InviteToTeam($teamId: ID!, $username: String!) {
    inviteToTeam(teamId: $teamId, username: $username) {
      ...Team
    }
  }
  ${TEAM_FRAGMENT}
`;

export const REVOKE_TEAM_INVITATION = gql`
  mutation RevokeTeamInvitation($teamId: ID!, $userId: ID!) {
    revokeTeamInvitation(teamId: $teamId, userId: $userId) {
      ...Team
    }
  }
  ${TEAM_FRAGMENT}
`;

export const ACCEPT_TEAM_INVITATION = gql`
  mutation AcceptTeamInvitation($teamId: ID!) {
    acceptTeamInvitation(teamId: $teamId) {
      ...Team
    }
  }
  ${TEAM_FRAGMENT}
`;

export const REJECT_TEAM_INVITATION = gql`
  mutation RejectTeamInvitation($teamId: ID!) {
    rejectTeamInvitation(teamId: $teamId)
  }
`;

export const SET_TEAM_DESCRIPTION = gql`
  mutation SetTeamDescription($teamId: ID!, $description: String!) {
    SetTeamDescription(teamId: $teamId, description: $description) {
      ...Team
    }
  }
  ${TEAM_FRAGMENT}
`;
