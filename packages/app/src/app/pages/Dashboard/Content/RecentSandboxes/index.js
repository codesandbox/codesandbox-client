import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Sandboxes from '../Sandboxes';

const QUERY = gql`
  {
    me {
      sandboxes(limit: 20, orderBy: { field: "updated_at", direction: DESC }) {
        shortid
        title
        description
        insertedAt
        updatedAt

        source {
          template
        }
      }
    }
  }
`;

export default () => (
  <Query query={QUERY}>
    {({ loading, error, data }) => {
      if (error) {
        return <div>Error!</div>;
      }

      return loading ? (
        <div>Loading...</div>
      ) : (
        <Sandboxes Header={'Recent Sandboxes'} sandboxes={data.me.sandboxes} />
      );
    }}
  </Query>
);
