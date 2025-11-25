import { client } from 'app/graphql/client';
import gql from 'graphql-tag';

const SIDEBAR_COLLECTION_FRAGMENT = gql`
  fragment SidebarCollection on Collection {
    id
    path
  }
`;

const TEAM_FRAGMENT = gql`
  fragment Team on Team {
    id
    name
    inviteToken
    description

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
      id
      
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
      id
      
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
      id
    }
  }
`;

export const DELETE_SANDBOXES_MUTATION = gql`
  mutation DeleteSandboxes($sandboxIds: [ID!]!) {
    deleteSandboxes(sandboxIds: $sandboxIds) {
      id
    }
  }
`;

export const SET_SANDBOXES_PRIVACY_MUTATION = gql`
  mutation SetSandboxesPrivacy($sandboxIds: [ID!]!, $privacy: Int!) {
    setSandboxesPrivacy(sandboxIds: $sandboxIds, privacy: $privacy) {
      id
    }
  }
`;

export const RENAME_SANDBOX_MUTATION = gql`
  mutation RenameSandbox($id: ID!, $title: String!) {
    renameSandbox(id: $id, title: $title) {
      id
    }
  }
`;

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
      id
      
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
      id
    }
  }
`;

export const REJECT_TEAM_INVITATION = gql`
  mutation RejectTeamInvitation($teamId: UUID4!) {
    rejectTeamInvitation(teamId: $teamId)
  }
`;
