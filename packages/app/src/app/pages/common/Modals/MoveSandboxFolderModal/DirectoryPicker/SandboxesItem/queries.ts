import gql from 'graphql-tag';

const SIDEBAR_COLLECTION_FRAGMENT = gql`
  fragment SidebarCollection on Collection {
    id
    path
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
