import gql from 'graphql-tag';

export const sandboxFragment = gql`
  fragment Sandbox on Sandbox {
    id
    alias
    title
    description
    insertedAt
    updatedAt
    removedAt
    privacy
    screenshotUrl
    screenshotOutdated

    source {
      template
    }

    customTemplate {
      id
    }

    forkedTemplate {
      id
      color
    }

    collection {
      path
      teamId
    }
  }
`;

export const sidebarCollection = gql`
  fragment SidebarCollection on Collection {
    id
    path
  }
`;

export const templateFragment = gql`
  fragment Template on Template {
    id
    color
    iconUrl
    published
    sandbox {
      id
      alias
      title
      description
      insertedAt
      updatedAt

      collection {
        team {
          name
        }
      }

      author {
        username
      }

      source {
        template
      }
    }
  }
`;
