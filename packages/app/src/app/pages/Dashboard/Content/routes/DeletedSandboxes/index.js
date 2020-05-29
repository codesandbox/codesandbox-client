import { Observer } from 'app/overmind';
import React from 'react';
import { Query } from 'react-apollo';
import Helmet from 'react-helmet';
import { MdHighlightRemove } from 'react-icons/md';

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
            const trashSandboxIds = orderedSandboxes.map(i => i.id);
            if (
              JSON.stringify(state.dashboard.trashSandboxIds) !==
              JSON.stringify(trashSandboxIds)
            ) {
              actions.dashboard.setTrashSandboxes({
                sandboxIds: trashSandboxIds,
              });
            }

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
                          Icon: <MdHighlightRemove />,
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
