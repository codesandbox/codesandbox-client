import React from 'react';
import { observer, inject } from 'mobx-react';
import { Query } from 'react-apollo';

import Sandboxes from '../../Sandboxes';

import { RECENT_SANDBOXES_CONTENT_QUERY } from '../../../queries';

const RecentSandboxes = ({ store }) => {
  document.title = 'Recent Sandboxes - CodeSandbox';
  return (
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
            hideFilters
            sandboxes={loading ? [] : data.me.sandboxes}
            page="recents"
          />
        );
      }}
    </Query>
  );
};

export default inject('signals', 'store')(observer(RecentSandboxes));
