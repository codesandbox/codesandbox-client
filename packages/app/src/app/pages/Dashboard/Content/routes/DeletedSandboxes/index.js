import React from 'react';
import { observer, inject } from 'mobx-react';
import { Query } from 'react-apollo';

import Sandboxes from '../../Sandboxes';

import { DELETED_SANDBOXES_CONTENT_QUERY } from '../../../queries';

const DeletedSandboxes = ({ store }) => (
  <Query
    variables={{
      orderField: store.dashboard.orderBy.field,
      orderDirection: store.dashboard.orderBy.order.toUpperCase(),
    }}
    fetchPolicy="cache-and-network"
    query={DELETED_SANDBOXES_CONTENT_QUERY}
  >
    {({ loading, error, data }) => {
      if (error) {
        return <div>Error!</div>;
      }

      return (
        <Sandboxes
          isLoading={loading}
          Header="Deleted Sandboxes"
          sandboxes={loading ? [] : data.me.sandboxes}
        />
      );
    }}
  </Query>
);

export default inject('signals', 'store')(observer(DeletedSandboxes));
