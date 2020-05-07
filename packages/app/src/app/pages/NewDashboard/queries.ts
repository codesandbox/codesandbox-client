// import { client } from 'app/graphql/client';
// import {
//   AddToCollectionMutation,
//   AddToCollectionMutationVariables,
//   DeleteSandboxesMutation,
//   DeleteSandboxesMutationVariables,
//   DeletedSandboxesQuery,
//   DeletedSandboxesQueryVariables,
//   PathedSandboxesQuery,
//   PathedSandboxesQueryVariables,
//   PermanentlyDeleteSandboxesMutation,
//   PermanentlyDeleteSandboxesMutationVariables,
// } from 'app/graphql/types';
// import gql from 'graphql-tag';
// import immer from 'immer';

// export const PATHED_SANDBOXES_FOLDER_QUERY = gql`
//   query PathedSandboxesFolders($teamId: ID) {
//     me {
//       collections(teamId: $teamId) {
//         ...SidebarCollection
//       }
//     }
//   }
//   ${SIDEBAR_COLLECTION_FRAGMENT}
// `;

// export const PATHED_SANDBOXES_CONTENT_QUERY = gql`
//   query PathedSandboxes($path: String!, $teamId: ID) {
//     me {
//       collections(teamId: $teamId) {
//         ...SidebarCollection
//       }
//       collection(path: $path, teamId: $teamId) {
//         id
//         path
//         sandboxes {
//           ...Sandbox
//         }
//       }
//     }
//   }
//   ${SANDBOX_FRAGMENT}
//   ${SIDEBAR_COLLECTION_FRAGMENT}
// `;

// export const RECENT_SANDBOXES_CONTENT_QUERY = gql`
//   query RecentSandboxes($orderField: String!, $orderDirection: Direction!) {
//     me {
//       sandboxes(
//         limit: 7
//         orderBy: { field: $orderField, direction: $orderDirection }
//       ) {
//         ...Sandbox
//       }
//     }
//   }
//   ${SANDBOX_FRAGMENT}
// `;

// export const RECENT_SANDBOXES_PAGE_QUERY = gql`
//   query RecentSandboxes($orderField: String!, $orderDirection: Direction!) {
//     me {
//       sandboxes(
//         limit: 50
//         orderBy: { field: $orderField, direction: $orderDirection }
//       ) {
//         ...Sandbox
//       }
//     }
//   }
//   ${SANDBOX_FRAGMENT}
// `;

// export const SEARCH_SANDBOXES_QUERY = gql`
//   query SearchSandboxes {
//     me {
//       sandboxes(orderBy: { field: "updated_at", direction: DESC }) {
//         ...Sandbox
//       }
//     }
//   }
//   ${SANDBOX_FRAGMENT}
// `;

// export const DELETED_SANDBOXES_CONTENT_QUERY = gql`
//   query DeletedSandboxes {
//     me {
//       sandboxes(
//         showDeleted: true
//         orderBy: { field: "updated_at", direction: DESC }
//       ) {
//         ...Sandbox
//       }
//     }
//   }
//   ${SANDBOX_FRAGMENT}
// `;

// export function addSandboxesToFolder(
//   selectedSandboxes,
//   path: string,
//   teamId: string | null
// ) {
//   return client.mutate<
//     AddToCollectionMutation,
//     AddToCollectionMutationVariables
//   >({
//     mutation: ADD_SANDBOXES_TO_FOLDER_MUTATION,
//     variables: {
//       sandboxIds: selectedSandboxes,
//       teamId,
//       collectionPath: path,
//     },
//     optimisticResponse: {
//       __typename: 'RootMutationType',
//       addToCollection: {
//         __typename: 'Collection',
//         // We keep this empty, because it will be loaded later regardless. We
//         // just want the main directory to update immediately
//         sandboxes: [],
//       },
//     },

//     refetchQueries: ['PathedSandboxes'],
//   });
// }

// export function undeleteSandboxes(selectedSandboxes) {
//   client.mutate<AddToCollectionMutation, AddToCollectionMutationVariables>({
//     mutation: ADD_SANDBOXES_TO_FOLDER_MUTATION,
//     // @ts-ignore
//     variables: {
//       sandboxIds: selectedSandboxes.toJS
//         ? selectedSandboxes.toJS()
//         : selectedSandboxes,
//       collectionPath: '/',
//     },
//     optimisticResponse: {
//       __typename: 'RootMutationType',
//       addToCollection: {
//         __typename: 'Collection',
//         // We keep this empty, because it will be loaded later regardless. We
//         // just want the main directory to update immediately
//         sandboxes: [],
//       },
//     },

//     refetchQueries: ['DeletedSandboxes'],
//   });
// }

// export function permanentlyDeleteSandboxes(selectedSandboxes: string[]) {
//   return client.mutate<
//     PermanentlyDeleteSandboxesMutation,
//     PermanentlyDeleteSandboxesMutationVariables
//   >({
//     mutation: PERMANENTLY_DELETE_SANDBOXES_MUTATION,
//     variables: {
//       sandboxIds: selectedSandboxes,
//     },
//     update: cache => {
//       try {
//         const oldDeleteCache = cache.readQuery<
//           DeletedSandboxesQuery,
//           DeletedSandboxesQueryVariables
//         >({
//           query: DELETED_SANDBOXES_CONTENT_QUERY,
//         });

//         const newDeleteCache = {
//           ...oldDeleteCache,
//           me: {
//             ...(oldDeleteCache && oldDeleteCache.me ? oldDeleteCache.me : null),
//             sandboxes: (oldDeleteCache?.me?.sandboxes || []).filter(
//               x => !selectedSandboxes.includes(x.id)
//             ),
//           },
//         };

//         cache.writeQuery({
//           query: DELETED_SANDBOXES_CONTENT_QUERY,
//           data: newDeleteCache,
//         });
//       } catch (e) {
//         // cache doesn't exist, no biggie!
//       }
//     },
//   });
// }

// export function deleteSandboxes(selectedSandboxes, collections = []) {
//   client.mutate<DeleteSandboxesMutation, DeleteSandboxesMutationVariables>({
//     mutation: DELETE_SANDBOXES_MUTATION,
//     variables: {
//       sandboxIds: selectedSandboxes.toJS
//         ? selectedSandboxes.toJS()
//         : selectedSandboxes,
//     },
//     refetchQueries: [
//       'DeletedSandboxes',
//       'PathedSandboxes',
//       'RecentSandboxes',
//       'SearchSandboxes',
//     ],
//     update: cache => {
//       if (collections) {
//         collections.forEach(({ path, teamId }) => {
//           try {
//             const variables = {
//               path,
//               teamId,
//             };

//             const oldFolderCacheData = cache.readQuery<
//               PathedSandboxesQuery,
//               PathedSandboxesQueryVariables
//             >({
//               query: PATHED_SANDBOXES_CONTENT_QUERY,
//               variables,
//             });

//             const data = immer(oldFolderCacheData, draft => {
//               if (
//                 !draft?.me?.collection ||
//                 !oldFolderCacheData?.me?.collection?.sandboxes
//               ) {
//                 return;
//               }
//               draft.me.collection.sandboxes = oldFolderCacheData.me.collection.sandboxes.filter(
//                 x => !selectedSandboxes.includes(x?.id)
//               );
//             });

//             if (data) {
//               cache.writeQuery<
//                 PathedSandboxesQuery,
//                 PathedSandboxesQueryVariables
//               >({
//                 query: PATHED_SANDBOXES_CONTENT_QUERY,
//                 variables,
//                 data,
//               });
//             }
//           } catch (e) {
//             // cache doesn't exist, no biggie!
//           }
//         });
//       }
//     },
//   });
// }

// export function setSandboxesPrivacy(
//   selectedSandboxes: string[],
//   privacy: 0 | 1 | 2
// ) {
//   client.mutate({
//     mutation: SET_SANDBOXES_PRIVACY_MUTATION,
//     variables: {
//       sandboxIds: selectedSandboxes,
//       privacy,
//     },
//   });
// }

// export const TEAM_QUERY = gql`
//   query Team($id: ID!) {
//     me {
//       team(id: $id) {
//         ...Team
//       }
//     }
//   }
//   ${TEAM_FRAGMENT}
// `;
