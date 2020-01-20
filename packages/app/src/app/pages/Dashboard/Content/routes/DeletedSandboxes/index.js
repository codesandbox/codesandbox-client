import { Observer } from 'app/overmind';
import React from 'react';
import { Query } from 'react-apollo';
import Helmet from 'react-helmet';
import RemoveIcon from 'react-icons/lib/md/highlight-remove';

import { DELETED_SANDBOXES_CONTENT_QUERY } from '../../../queries';
import { Content as Sandboxes } from '../../Sandboxes';
import { getPossibleTemplates } from '../../Sandboxes/utils';

const DeletedSandboxes = () => (
  <>
    <Helmet>
      <title>Deleted Sandboxes - CodeSandbox</title>
    </Helmet>
    <Query
      fetchPolicy="cache-and-network"
      query={DELETED_SANDBOXES_CONTENT_QUERY}
    >
      {({ loading, error, data }) => (
        <Observer>
          {({ state, actions }) => {
            if (error) {
              return <div>Error!</div>;
            }

            const sandboxes = loading
              ? []
              : (data && data.me && data.me.sandboxes) || [];

            const possibleTemplates = getPossibleTemplates(sandboxes);

            const orderedSandboxes = state.dashboard.getFilteredSandboxes(
              sandboxes
            );
            actions.dashboard.setTrashSandboxes({
              sandboxIds: orderedSandboxes.map(i => i.id),
            });

            return (
              <Sandboxes
                isLoading={loading}
                Header="Deleted Sandboxes"
                sandboxes={orderedSandboxes}
                possibleTemplates={possibleTemplates}
                actions={
                  orderedSandboxes.length
                    ? [
                        {
                          name: 'Empty Trash',
                          Icon: <RemoveIcon />,
                          run: () => {
                            actions.modalOpened({
                              modal: 'emptyTrash',
                            });
                          },
                        },
                      ]
                    : []
                }
              />
            );
          }}
        </Observer>
      )}
    </Query>
  </>
);

export default DeletedSandboxes;
