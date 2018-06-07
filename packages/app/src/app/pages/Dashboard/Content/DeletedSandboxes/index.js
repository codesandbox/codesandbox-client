import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Sandboxes from '../Sandboxes';

import { RECENT_SANDBOXES_CONTENT_QUERY } from '../../queries';

export default () => (
  <Query query={RECENT_SANDBOXES_CONTENT_QUERY}>
    {({ loading, error, data }) => {
      if (error) {
        return <div>Error!</div>;
      }

      return (
        <Sandboxes
          isLoading={loading}
          Header={'Deleted Sandboxes'}
          sandboxes={loading ? [] : data.me.sandboxes}
        />
      );
    }}
  </Query>
);
