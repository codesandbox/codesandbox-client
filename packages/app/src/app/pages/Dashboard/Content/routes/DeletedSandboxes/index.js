import React from 'react';
import { inject, Observer } from 'mobx-react';
import { uniq } from 'lodash-es';
import { Query } from 'react-apollo';

import Sandboxes from '../../Sandboxes';

import { DELETED_SANDBOXES_CONTENT_QUERY } from '../../../queries';

const DeletedSandboxes = ({ store }) => {
  document.title = 'Deleted Sandboxes - CodeSandbox';
  return (
    <Query
      fetchPolicy="cache-and-network"
      query={DELETED_SANDBOXES_CONTENT_QUERY}
    >
      {({ loading, error, data }) => (
        <Observer>
          {() => {
            if (error) {
              return <div>Error!</div>;
            }

            const sandboxes = loading
              ? []
              : (data && data.me && data.me.sandboxes) || [];

            const possibleTemplates = uniq(
              sandboxes.map(x => x.source.template)
            );

            const orderedSandboxes = store.dashboard.getFilteredSandboxes(
              sandboxes
            );

            return (
              <Sandboxes
                isLoading={loading}
                Header="Deleted Sandboxes"
                sandboxes={orderedSandboxes}
                possibleTemplates={possibleTemplates}
              />
            );
          }}
        </Observer>
      )}
    </Query>
  );
};

export default inject('signals', 'store')(DeletedSandboxes);
