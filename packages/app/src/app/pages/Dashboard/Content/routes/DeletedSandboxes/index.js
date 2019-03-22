import React from 'react';
import { inject, Observer } from 'mobx-react';
import { uniq } from 'lodash-es';
import { Query } from 'react-apollo';
import Button from 'common/lib/components/Button';

import Sandboxes from '../../Sandboxes';

import { DELETED_SANDBOXES_CONTENT_QUERY } from '../../../queries';

const DeletedSandboxes = ({ store, signals }) => {
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
            signals.dashboard.setTrashSandboxes({
              sandboxIds: orderedSandboxes.map(i => i.id),
            });

            const DeleteButton = () =>
              orderedSandboxes.length ? (
                <Button
                  css={`
                    width: 200px;
                    margin: 20px 0;
                  `}
                  small
                  danger
                  onClick={() => {
                    signals.modalOpened({
                      modal: 'emptyTrash',
                    });
                  }}
                >
                  Empty Trash
                </Button>
              ) : null;

            return (
              <Sandboxes
                isLoading={loading}
                Header="Deleted Sandboxes"
                SubHeader={<DeleteButton />}
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
