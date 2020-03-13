import gql from 'graphql-tag';

export const commentFragment = gql`
  fragment Comment on Comment {
    id
    content
    insertedAt
    updatedAt
    user {
      id
      firstName
      lastName
      name
      username
      avatarUrl
    }
  }
`;
