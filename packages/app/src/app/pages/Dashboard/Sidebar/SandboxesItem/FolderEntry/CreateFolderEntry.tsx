import Input from '@codesandbox/common/es/components/Input';
import track from '@codesandbox/common/es/utils/analytics';
import { ESC } from '@codesandbox/common/es/utils/keycodes';
import React from 'react';
import { Mutation } from 'react-apollo';
import { MdCreateNewFolder } from 'react-icons/md';

import {
  CREATE_FOLDER_MUTATION,
  PATHED_SANDBOXES_FOLDER_QUERY,
} from '../../../queries';
import {
  AnimatedChevron,
  CreateDirectoryContainer,
  IconContainer,
} from './elements';

interface Props {
  basePath: string;
  teamId: string | undefined;
  close: () => void;
  depth: number;
  noFocus?: boolean;
}

export const CreateFolderEntry = ({
  basePath,
  teamId,
  noFocus,
  close,
  depth,
}: Props) => {
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
                const variables: { teamId?: string } = {};
                if (teamId) {
                  variables.teamId = teamId;
                }
                // Read the data from our cache for this query.
                const d: { me: any } = proxy.readQuery({
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
              <MdCreateNewFolder />
            </IconContainer>{' '}
            <Input
              placeholder="Folder Name"
              style={{ marginRight: '1rem' }}
              onBlur={close}
              onKeyDown={e => {
                if (e.keyCode === ESC) {
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
