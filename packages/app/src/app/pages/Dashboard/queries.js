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
  query PathedSandboxes($path: String!) {
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

        oldDeleteCache.me.sandboxes = oldDeleteCache.me.sandboxes.filter(
          x => selectedSandboxes.indexOf(x.id) === -1
        );

        cache.writeQuery({
          query: DELETED_SANDBOXES_CONTENT_QUERY,
          data: oldDeleteCache,
        });
      } catch (e) {
        // cache doesn't exist, no biggie!
      }
    },
  });
}

export function deleteSandboxes(selectedSandboxes, collectionPaths = null) {
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
      if (collectionPaths) {
        collectionPaths.forEach(collectionPath => {
          try {
            const oldFolderCacheData = cache.readQuery({
              query: PATHED_SANDBOXES_CONTENT_QUERY,
              variables: { path: collectionPath },
            });

            oldFolderCacheData.me.collection.sandboxes = oldFolderCacheData.me.collection.sandboxes.filter(
              x => selectedSandboxes.indexOf(x.id) === -1
            );

            cache.writeQuery({
              query: PATHED_SANDBOXES_CONTENT_QUERY,
              variables: { path: collectionPath },
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
