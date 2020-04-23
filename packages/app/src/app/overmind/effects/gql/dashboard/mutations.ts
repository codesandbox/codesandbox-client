// import {
//   CreateCommentMutation,
//   CreateCommentMutationVariables,
//   DeleteCommentMutation,
//   DeleteCommentMutationVariables,
//   ResolveCommentMutation,
//   ResolveCommentMutationVariables,
//   UnresolveCommentMutation,
//   UnresolveCommentMutationVariables,
//   UpdateCommentMutation,
//   UpdateCommentMutationVariables,
// } from 'app/graphql/types';
// import gql from 'graphql-tag';
// import { Query } from 'overmind-graphql';

// import { commentFragment } from './fragments';

// export const unresolveComment: Query<
//   UnresolveCommentMutation,
//   UnresolveCommentMutationVariables
// > = gql`
//   mutation UnresolveComment($commentId: ID!, $sandboxId: ID!) {
//     unresolveComment(commentId: $commentId, sandboxId: $sandboxId) {
//       id
//     }
//   }
// `;
