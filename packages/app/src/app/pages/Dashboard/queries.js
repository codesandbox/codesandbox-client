import gql from 'graphql-tag';

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

    source {
      template
    }

    collection {
      path
    }
  }
`;

export const PATHED_SANDBOXES_FOLDER_QUERY = gql`
  {
    me {
      collections {
        ...SidebarCollection
      }
    }
  }
  ${SIDEBAR_COLLECTION_FRAGMENT}
`;

export const CREATE_FOLDER_MUTATION = gql`
  mutation createCollection($path: String!) {
    createCollection(path: $path) {
      ...SidebarCollection
    }
  }
  ${SIDEBAR_COLLECTION_FRAGMENT}
`;

export const DELETE_FOLDER_MUTATION = gql`
  mutation deleteCollection($path: String!) {
    deleteCollection(path: $path) {
      ...SidebarCollection
    }
  }
  ${SIDEBAR_COLLECTION_FRAGMENT}
`;

export const RENAME_FOLDER_MUTATION = gql`
  mutation renameCollection($path: String!, $newPath: String!) {
    renameCollection(path: $path, newPath: $newPath) {
      ...SidebarCollection
    }
  }
  ${SIDEBAR_COLLECTION_FRAGMENT}
`;

export const ADD_SANDBOXES_TO_FOLDER_MUTATION = gql`
  mutation AddToCollection($collectionPath: String!, $sandboxIds: [ID]!) {
    addToCollection(collectionPath: $collectionPath, sandboxIds: $sandboxIds) {
      sandboxes {
        ...Sandbox
      }
    }
  }
  ${SANDBOX_FRAGMENT}
`;

export const PATHED_SANDBOXES_CONTENT_QUERY = gql`
  query collection($path: String!) {
    me {
      collection(path: $path) {
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
  query sandboxes($orderField: String!, $orderDirection: Direction!) {
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
