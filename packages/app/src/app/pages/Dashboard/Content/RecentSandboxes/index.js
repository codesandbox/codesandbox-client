import React from 'react';
import { observer, inject } from 'mobx-react';
import { Query } from 'react-apollo';

import Sandboxes from '../Sandboxes';

import { RECENT_SANDBOXES_CONTENT_QUERY } from '../../queries';

const RecentSandboxes = ({ store }) => (
  <Query
    variables={{
      orderField: store.dashboard.orderBy.field,
      orderDirection: store.dashboard.orderBy.order.toUpperCase(),
    }}
    query={RECENT_SANDBOXES_CONTENT_QUERY}
  >
    {({ loading, error, data }) => {
      if (error) {
        return <div>Error!</div>;
      }

      return (
        <Sandboxes
          isLoading={loading}
          Header={'Recent Sandboxes'}
          sandboxes={loading ? [] : data.me.sandboxes}
        />
      );
    }}
  </Query>
);

export default inject('signals', 'store')(observer(RecentSandboxes));
