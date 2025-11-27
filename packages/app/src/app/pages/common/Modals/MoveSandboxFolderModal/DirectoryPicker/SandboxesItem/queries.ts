import gql from 'graphql-tag';
import { COLLECTION_BASIC } from 'app/overmind/effects/gql/common/fragments';

export const PATHED_SANDBOXES_FOLDER_QUERY = gql`
  query PathedSandboxesFolders($teamId: ID) {
    me {
      id
      
      collections(teamId: $teamId) {
        ...collectionBasic
      }
    }
  }
  ${COLLECTION_BASIC}
`;

export const CREATE_FOLDER_MUTATION = gql`
  mutation createCollection($path: String!, $teamId: UUID4) {
    createCollection(path: $path, teamId: $teamId) {
      ...collectionBasic
    }
  }
  ${COLLECTION_BASIC}
`;

export const DELETE_FOLDER_MUTATION = gql`
  mutation deleteCollection($path: String!, $teamId: UUID4) {
    deleteCollection(path: $path, teamId: $teamId) {
      ...collectionBasic
    }
  }
  ${COLLECTION_BASIC}
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
      ...collectionBasic
    }
  }
  ${COLLECTION_BASIC}
`;
