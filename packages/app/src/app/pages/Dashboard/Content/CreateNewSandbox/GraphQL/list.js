import gql from 'graphql-tag';

export const LIST_TEMPLATES = gql`
  query listTemplates {
    me {
      templates {
        title
        description
        color
        iconUrl
        id
        published
        sandbox {
          id
          alias
          source {
            template
          }
        }
      }
    }
  }
`;
