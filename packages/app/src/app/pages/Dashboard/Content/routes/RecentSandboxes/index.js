import React from 'react';
import { observer, inject } from 'mobx-react';

import { Query } from 'react-apollo';

import getMostUsedTemplate from '../../../utils/getMostUsedTemplate';

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

        let mostUsedTemplate = null;
        if (!loading) {
          try {
            mostUsedTemplate = getMostUsedTemplate(data.me.sandboxes);
          } catch (e) {
            // Not critical
          }
        }

        return (
          <Sandboxes
            isLoading={loading}
            Header="Recent Sandboxes"
            ExtraElement={({ style }) => (
              <CreateNewSandbox
                mostUsedSandboxTemplate={mostUsedTemplate}
                style={style}
              />
            )}
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
