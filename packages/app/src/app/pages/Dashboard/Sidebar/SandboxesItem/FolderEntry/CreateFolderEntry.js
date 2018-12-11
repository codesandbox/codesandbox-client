import React from 'react';
import { Mutation } from 'react-apollo';

import AddFolderIcon from 'react-icons/lib/md/create-new-folder';
import Input from 'common/components/Input';
import track from 'common/utils/analytics';

import {
  CreateDirectoryContainer,
  IconContainer,
  AnimatedChevron,
} from './elements';

import {
  PATHED_SANDBOXES_FOLDER_QUERY,
  CREATE_FOLDER_MUTATION,
} from '../../../queries';

export default ({ basePath, teamId, noFocus, close, depth }) => {
  let input;
  return (
    <Mutation mutation={CREATE_FOLDER_MUTATION}>
      {mutate => (
        <form
          onSubmit={e => {
            e.preventDefault();
            const path = basePath + '/' + input.value;

            track('Dashboard - Create Directory', {
              path,
            });

            mutate({
              variables: { path, teamId },
              optimisticResponse: {
                __typename: 'Mutation',
                createCollection: {
                  id: 'optimistic-id',
                  path,
                  __typename: 'Collection',
                },
              },
              update: (proxy, { data: { createCollection } }) => {
                const variables = {};
                if (teamId) {
                  variables.teamId = teamId;
                }
                // Read the data from our cache for this query.
                const d = proxy.readQuery({
                  query: PATHED_SANDBOXES_FOLDER_QUERY,
                  variables,
                });

                // Add our collection from the mutation to the end.
                d.me.collections.push(createCollection);
                // Write our data back to the cache.
                proxy.writeQuery({
                  query: PATHED_SANDBOXES_FOLDER_QUERY,
                  variables,
                  data: d,
                });
              },
            });

            input.value = '';

            close();
          }}
        >
          <CreateDirectoryContainer depth={depth + 1}>
            <IconContainer style={{ marginRight: '0.25rem' }}>
              <AnimatedChevron open={false} />
              <AddFolderIcon />
            </IconContainer>{' '}
            <Input
              small
              placeholder="Folder Name"
              style={{ marginRight: '1rem' }}
              onBlur={close}
              onKeyDown={e => {
                if (e.keyCode === 27) {
                  e.preventDefault();
                  close();
                }
              }}
              ref={el => {
                if (el) {
                  if (!noFocus) {
                    el.focus();
                    el.select();
                  }
                  input = el;
                }
              }}
              block
            />
          </CreateDirectoryContainer>
        </form>
      )}
    </Mutation>
  );
};
