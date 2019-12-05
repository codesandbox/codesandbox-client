import gql from 'graphql-tag';

export const UNBOOKMARK_TEMPLATE_FROM_DASHBOARD = gql`
  mutation unbookmarkTemplateFromDashboard($template: ID!, $teamId: ID) {
    unbookmarkTemplate(templateId: $template, teamId: $teamId) {
      id
      bookmarked {
        isBookmarked
        entity {
          __typename
          ... on User {
            id
            name: username
          }
          ... on Team {
            id
            name
          }
        }
      }
    }
  }
`;
