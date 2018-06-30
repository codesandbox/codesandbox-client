import React from 'react';
import { observer, inject } from 'mobx-react';
import { Query } from 'react-apollo';

import Sandboxes from '../../Sandboxes';

import CreateNewSandbox from '../../CreateNewSandbox';
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
            Header="Recent Sandboxes"
            ExtraElement={({ style }) => <CreateNewSandbox style={style} />}
            hideFilters
            sandboxes={loading ? [] : data.me.sandboxes}
            page="recent"
          />
        );
      }}
    </Query>
  );
};

export default inject('signals', 'store')(observer(RecentSandboxes));
